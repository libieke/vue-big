<template>
  <div
    ref="chartStage"
    class="webgl-chart"
    :style="{
      width,
      height,
      gridTemplateColumns: `${chartWidth} ${legendWidth}`,
    }"
  >
    <!-- 左侧图表区域 -->
    <div
      ref="chartStage"
      class="chart-stage"
      @mousemove="handleMouseMove"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseLeave"
    >
      <!-- WebGL 绘图 -->
      <canvas ref="glCanvas" class="gl-canvas"></canvas>

      <!-- Canvas 2D 坐标轴 -->
      <canvas ref="axisCanvas" class="axis-canvas"></canvas>

      <!-- Tooltip -->
      <div
        v-if="tooltip.visible"
        class="chart-tooltip"
        :style="{
          left: tooltip.left + 'px',
          top: tooltip.top + 'px',
        }"
      >
        <div class="tooltip-title">
          {{ tooltip.x }}
        </div>

        <div class="tooltip-row">
          <span class="blue-dot"></span>
          报警次数：{{ tooltip.bar }}
        </div>

        <div class="tooltip-row">
          <span class="red-dot"></span>
          报警占比：{{ tooltip.line }}
          {{ tooltip.line === "--" ? "" : "%" }}
        </div>
      </div>
    </div>

    <!-- 右侧图例区域 -->
    <div class="chart-legend-panel">
      <div class="chart-legend">
        <div class="legend-item">
          <i class="blue-dot"></i>
          <span>报警次数(个)</span>
        </div>

        <div class="legend-item">
          <i class="red-dot"></i>
          <span>报警占比(%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec3 a_color;

  varying vec3 v_color;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_color = a_color;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  varying vec3 v_color;

  void main() {
    gl_FragColor = vec4(v_color, 1.0);
  }
`;

export default {
  name: "BarLineWebGL",

  props: {
    chartOptions: {
      type: Object,
      default: () => ({
        title: "",
        subtext: "",
        xData: [],
        yData: [],
        lineData: [],
      }),
    },
    // 左侧图表区域宽度
    chartWidth: {
      type: String,
      default: "1fr",
    },

    // 右侧图例区域宽度
    legendWidth: {
      type: String,
      default: "220px",
    },
    width: {
      type: String,
      default: "100%",
    },

    height: {
      type: String,
      default: "450px",
    },

    // 最大同时显示的数据量
    maxVisiblePoints: {
      type: Number,
      default: 10000,
    },
  },

  data() {
    return {
      gl: null,
      program: null,
      buffer: null,
      aPosition: null,
      aColor: null,

      canvasWidth: 0,
      canvasHeight: 0,

      // 图表绘图区
      plot: {
        left: 65,
        top: 65,
        right: 30,
        bottom: 55,
      },

      // 当前查看的数据范围
      viewStart: 0,
      viewEnd: 0,

      // 鼠标拖动
      dragging: false,
      dragStartX: 0,
      dragStartViewStart: 0,

      // Tooltip
      tooltip: {
        visible: false,
        left: 0,
        top: 0,
        x: "",
        bar: 0,
        line: 0,
      },

      resizeObserver: null,
      resizeHandler: null,
    };
  },

  computed: {
    dataLength() {
      const options = this.chartOptions || {};

      return Math.min(
        (options.xData || []).length,
        (options.yData || []).length,
        (options.lineData || []).length,
      );
    },
  },

  watch: {
    // 父组件整体替换 chartOptions 时触发
    chartOptions() {
      this.refreshChart();
    },

    // 异步数据加载完成，数据长度发生变化时触发
    dataLength(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.refreshChart();
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.initWebGL();
      this.initResize();

      // 绑定滚轮缩放
      this.$refs.chartStage.addEventListener("wheel", this.handleWheel, {
        passive: false,
      });

      this.resetView();
      this.renderChart();
    });
  },

  beforeDestroy() {
    this.destroyWebGL();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
  },

  methods: {
    refreshChart() {
      this.$nextTick(() => {
        if (!this.gl) {
          this.initWebGL();
        }

        // 数据为空时不绘制
        if (!this.dataLength) {
          this.viewStart = 0;
          this.viewEnd = 0;
          this.renderChart();
          return;
        }

        // 重新计算显示范围
        this.resetView();

        // 重新绘制
        this.renderChart();
      });
    },
    // 编译 Shader
    createShader(gl, type, source) {
      const shader = gl.createShader(type);

      if (!shader) {
        throw new Error("WebGL Shader 创建失败");
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(message || "Shader 编译失败");
      }

      return shader;
    },

    // 初始化 WebGL
    initWebGL() {
      const canvas = this.$refs.glCanvas;

      if (!canvas) return;

      const gl =
        canvas.getContext("webgl", {
          antialias: true,
          alpha: true,
        }) || canvas.getContext("experimental-webgl");

      if (!gl) {
        console.error("当前浏览器不支持 WebGL");
        return;
      }

      try {
        const vertexShader = this.createShader(
          gl,
          gl.VERTEX_SHADER,
          VERTEX_SHADER,
        );

        const fragmentShader = this.createShader(
          gl,
          gl.FRAGMENT_SHADER,
          FRAGMENT_SHADER,
        );

        const program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program));
        }

        this.gl = gl;
        this.program = program;
        this.buffer = gl.createBuffer();

        this.aPosition = gl.getAttribLocation(program, "a_position");

        this.aColor = gl.getAttribLocation(program, "a_color");

        gl.useProgram(program);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.clearColor(0, 0, 0, 0);
      } catch (error) {
        console.error("WebGL 初始化失败：", error);
      }
    },

    // 重置数据查看范围
    resetView() {
      if (!this.dataLength) {
        this.viewStart = 0;
        this.viewEnd = 0;
        return;
      }

      this.viewStart = 0;
      this.viewEnd = Math.min(this.dataLength, this.maxVisiblePoints);
    },

    // 监听容器尺寸
    initResize() {
      const resize = () => {
        this.$nextTick(() => {
          this.renderChart();
        });
      };

      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(resize);
        this.resizeObserver.observe(this.$refs.chartStage);
      } else {
        this.resizeHandler = resize;
        window.addEventListener("resize", resize);
      }
    },

    // 更新 Canvas 尺寸
    resizeCanvas() {
      const root = this.$refs.chartStage;

      if (!root) return;

      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvasWidth = rect.width;
      this.canvasHeight = rect.height;

      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      [this.$refs.glCanvas, this.$refs.axisCanvas].forEach((canvas) => {
        if (!canvas) return;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
      });

      if (this.gl) {
        this.gl.viewport(0, 0, width, height);
      }
    },

    // 计算绘图区
    getPlotSize() {
      const availableWidth =
        this.canvasWidth - this.plot.left - this.plot.right;

      const width =
        this.contentWidth > 0
          ? Math.min(this.contentWidth, availableWidth)
          : availableWidth;

      // 绘图区居中
      const left = this.plot.left + (availableWidth - width) / 2;

      return {
        left,
        top: this.plot.top,
        width: Math.max(0, width),
        height: Math.max(
          0,
          this.canvasHeight - this.plot.top - this.plot.bottom,
        ),
      };
    },

    // 像素坐标转换为 WebGL 坐标
    toClipX(x) {
      return (x / this.canvasWidth) * 2 - 1;
    },

    toClipY(y) {
      return 1 - (y / this.canvasHeight) * 2;
    },

    // 添加一个顶点
    addVertex(list, x, y, color) {
      list.push(this.toClipX(x), this.toClipY(y), color[0], color[1], color[2]);
    },

    // 添加矩形，拆成两个三角形
    addRect(list, x1, y1, x2, y2, color) {
      this.addVertex(list, x1, y1, color);
      this.addVertex(list, x2, y1, color);
      this.addVertex(list, x2, y2, color);

      this.addVertex(list, x1, y1, color);
      this.addVertex(list, x2, y2, color);
      this.addVertex(list, x1, y2, color);
    },

    // 生成 WebGL 数据
    buildVertices() {
      const options = this.chartOptions || {};

      const xData = options.xData || [];
      const yData = options.yData || [];
      const lineData = options.lineData || [];

      const start = Math.max(0, this.viewStart);
      const end = Math.min(this.dataLength, this.viewEnd);

      const count = end - start;

      const plot = this.getPlotSize();

      if (!count || !plot.width || !plot.height) {
        return {
          bars: [],
          line: [],
        };
      }

      const step = plot.width / count;
      const barWidth = Math.max(1, Math.min(step * 0.65, 18));

      let maxBar = 0;
      let minLine = Infinity;
      let maxLine = -Infinity;

      for (let i = start; i < end; i++) {
        const bar = Number(yData[i]);
        const line = Number(lineData[i]);

        if (Number.isFinite(bar)) {
          maxBar = Math.max(maxBar, bar);
        }

        if (Number.isFinite(line)) {
          minLine = Math.min(minLine, line);
          maxLine = Math.max(maxLine, line);
        }
      }

      maxBar = Math.max(maxBar, 1);

      if (!Number.isFinite(minLine)) minLine = 0;
      if (!Number.isFinite(maxLine)) maxLine = 100;

      if (maxLine === minLine) {
        maxLine = minLine + 1;
      }

      const bars = [];
      const line = [];

      const barColor = [32 / 255, 124 / 255, 219 / 255];

      const lineColor = [235 / 255, 80 / 255, 66 / 255];

      const zeroY = plot.top + plot.height;

      for (let i = 0; i < count; i++) {
        const index = start + i;

        const xCenter = plot.left + step * (i + 0.5);

        // 柱状图
        const barValue = Number(yData[index]);

        if (Number.isFinite(barValue)) {
          const barHeight = (Math.max(0, barValue) / maxBar) * plot.height;

          this.addRect(
            bars,
            xCenter - barWidth / 2,
            zeroY - barHeight,
            xCenter + barWidth / 2,
            zeroY,
            barColor,
          );
        }

        // 折线图
        const lineValue = Number(lineData[index]);

        if (Number.isFinite(lineValue)) {
          const lineY =
            plot.top +
            plot.height -
            ((lineValue - minLine) / (maxLine - minLine)) * plot.height;

          this.addVertex(line, xCenter, lineY, lineColor);
        } else {
          // 遇到无效值时，断开折线
          line.push(NaN, NaN, NaN, NaN, NaN);
        }
      }

      return {
        bars,
        line,
      };
    },

    // 绘制 WebGL
    drawWebGL() {
      if (!this.gl || !this.program) return;

      const gl = this.gl;

      const vertices = this.buildVertices();

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      gl.enableVertexAttribArray(this.aPosition);
      gl.enableVertexAttribArray(this.aColor);

      gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 20, 0);

      gl.vertexAttribPointer(this.aColor, 3, gl.FLOAT, false, 20, 8);

      // 绘制柱状图
      if (vertices.bars.length) {
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(vertices.bars),
          gl.DYNAMIC_DRAW,
        );

        gl.drawArrays(gl.TRIANGLES, 0, vertices.bars.length / 5);
      }

      // 绘制折线图
      if (vertices.line.length) {
        const segments = [];
        let current = [];

        const flush = () => {
          if (current.length >= 10) {
            segments.push(current);
          }
          current = [];
        };

        for (let i = 0; i < vertices.line.length; i += 5) {
          const x = vertices.line[i];
          const y = vertices.line[i + 1];

          if (!Number.isFinite(x) || !Number.isFinite(y)) {
            flush();
            continue;
          }

          current.push(...vertices.line.slice(i, i + 5));
        }

        flush();

        gl.lineWidth(2);

        segments.forEach((segment) => {
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(segment),
            gl.DYNAMIC_DRAW,
          );

          gl.drawArrays(gl.LINE_STRIP, 0, segment.length / 5);
        });
      }
    },

    // 绘制坐标轴、网格、文字
    drawAxis() {
      const canvas = this.$refs.axisCanvas;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const width = this.canvasWidth;
      const height = this.canvasHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);

      const plot = this.getPlotSize();

      const options = this.chartOptions || {};

      const title = options.title || "";
      const subtext = options.subtext || "";

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "500 22px Arial";
      ctx.textAlign = "left";
      ctx.fillText(title, 5, 30);

      ctx.textAlign = "right";
      ctx.font = "18px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(subtext, width - 10, 30);

      if (!plot.width || !plot.height) {
        ctx.restore();
        return;
      }

      const start = Math.max(0, this.viewStart);
      const end = Math.min(this.dataLength, this.viewEnd);

      const yData = options.yData || [];
      const lineData = options.lineData || [];

      let maxBar = 0;
      let minLine = Infinity;
      let maxLine = -Infinity;

      for (let i = start; i < end; i++) {
        const bar = Number(yData[i]);
        const line = Number(lineData[i]);

        if (Number.isFinite(bar)) {
          maxBar = Math.max(maxBar, bar);
        }

        if (Number.isFinite(line)) {
          minLine = Math.min(minLine, line);
          maxLine = Math.max(maxLine, line);
        }
      }

      maxBar = Math.max(maxBar, 1);

      if (!Number.isFinite(minLine)) minLine = 0;
      if (!Number.isFinite(maxLine)) maxLine = 100;

      if (maxLine === minLine) {
        maxLine = minLine + 1;
      }

      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;

      ctx.fillStyle = "#6d7b8e";
      ctx.font = "12px Arial";

      // Y轴网格和标签
      for (let i = 0; i <= 4; i++) {
        const y = plot.top + (plot.height * i) / 4;

        ctx.beginPath();
        ctx.moveTo(plot.left, y);
        ctx.lineTo(plot.left + plot.width, y);
        ctx.stroke();

        const barLabel = ((maxBar * (4 - i)) / 4).toFixed(0);

        const lineLabel = (maxLine - ((maxLine - minLine) * i) / 4).toFixed(1);

        ctx.textAlign = "right";
        ctx.fillText(barLabel, plot.left - 8, y + 4);

        ctx.textAlign = "left";
        ctx.fillText(lineLabel + "%", plot.left + plot.width + 6, y + 4);
      }

      // X轴标签，最多显示 7 个
      const count = Math.max(0, end - start);
      const xData = options.xData || [];

      ctx.textAlign = "center";
      ctx.fillStyle = "#6d7b8e";

      const labelCount = Math.min(count, 7);

      for (let i = 0; i < labelCount; i++) {
        const offset =
          labelCount <= 1
            ? 0
            : Math.round((i * (count - 1)) / (labelCount - 1));

        const index = start + offset;

        const x =
          plot.left + (plot.width * (offset + 0.5)) / Math.max(count, 1);

        const label = String(xData[index] ?? "");

        ctx.fillText(
          label.length > 12 ? label.slice(0, 12) + "..." : label,
          x,
          height - 20,
        );
      }

      ctx.restore();
    },

    // 统一渲染
    renderChart() {
      if (!this.$refs.chartStage) return;

      this.resizeCanvas();
      this.drawWebGL();
      this.drawAxis();
    },

    // 获取鼠标对应的数据索引
    getMouseIndex(event) {
      const root = this.$refs.chartStage;

      if (!root) return -1;

      const rect = root.getBoundingClientRect();

      const mouseX = event.clientX - rect.left;

      const plot = this.getPlotSize();

      if (mouseX < plot.left || mouseX > plot.left + plot.width) {
        return -1;
      }

      const count = this.viewEnd - this.viewStart;

      if (!count) return -1;

      const offset = Math.floor(((mouseX - plot.left) / plot.width) * count);

      return Math.min(this.viewEnd - 1, this.viewStart + offset);
    },

    // 鼠标悬停
    handleMouseMove(event) {
      const index = this.getMouseIndex(event);

      if (this.dragging) {
        const rect = this.$refs.chartStage.getBoundingClientRect();
        const plot = this.getPlotSize();

        const count = this.viewEnd - this.viewStart;

        const deltaX = event.clientX - this.dragStartX;

        const shift = Math.round((deltaX / Math.max(plot.width, 1)) * count);

        const total = this.dataLength;

        let nextStart = this.dragStartViewStart - shift;

        nextStart = Math.max(0, Math.min(total - count, nextStart));

        this.viewStart = nextStart;
        this.viewEnd = nextStart + count;

        this.tooltip.visible = false;
        this.renderChart();

        return;
      }

      if (index < 0) {
        this.tooltip.visible = false;
        return;
      }

      const rect = this.$refs.chartStage.getBoundingClientRect();

      const options = this.chartOptions;

      this.tooltip = {
        visible: true,
        left: Math.min(event.clientX - rect.left + 12, rect.width - 190),
        top: Math.max(35, event.clientY - rect.top - 55),
        x: String(options.xData[index]),
        bar: options.yData[index],
        line: options.lineData[index],
      };
    },

    handleMouseDown(event) {
      if (event.button !== 0) return;

      const index = this.getMouseIndex(event);

      if (index < 0) return;

      this.dragging = true;
      this.dragStartX = event.clientX;
      this.dragStartViewStart = this.viewStart;
    },

    handleMouseUp() {
      this.dragging = false;
    },

    handleMouseLeave() {
      this.dragging = false;
      this.tooltip.visible = false;
    },

    // 鼠标滚轮缩放
    handleWheel(event) {
      event.preventDefault();

      const total = this.dataLength;

      if (total <= 1) return;

      const oldCount = this.viewEnd - this.viewStart;

      const factor = event.deltaY > 0 ? 1.25 : 0.8;

      const nextCount = Math.max(
        20,
        Math.min(this.maxVisiblePoints, total, Math.round(oldCount * factor)),
      );

      if (nextCount === oldCount) return;

      const rect = this.$refs.chartStage.getBoundingClientRect();
      const plot = this.getPlotSize();

      const mouseX = event.clientX - rect.left;

      const ratio = Math.max(0, Math.min(1, (mouseX - plot.left) / plot.width));

      const anchor = this.viewStart + oldCount * ratio;

      let nextStart = Math.round(anchor - nextCount * ratio);

      nextStart = Math.max(0, Math.min(total - nextCount, nextStart));

      this.viewStart = nextStart;
      this.viewEnd = nextStart + nextCount;

      this.tooltip.visible = false;
      this.renderChart();
    },

    // 清理 WebGL
    destroyWebGL() {
      if (this.$refs.chartStage) {
        this.$refs.chartStage.removeEventListener("wheel", this.handleWheel);
      }

      if (this.gl) {
        if (this.buffer) {
          this.gl.deleteBuffer(this.buffer);
        }

        if (this.program) {
          this.gl.deleteProgram(this.program);
        }

        this.gl = null;
      }

      this.buffer = null;
      this.program = null;
    },
  },
};
</script>

<style scoped>
.webgl-chart {
  position: relative;
  display: grid;
  overflow: hidden;
  min-width: 0;
  background: transparent;
  user-select: none;
}

/* 左侧图表区域 */
.chart-stage {
  position: relative;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  cursor: crosshair;
}

.gl-canvas,
.axis-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.gl-canvas {
  z-index: 1;
  pointer-events: none;
}

.axis-canvas {
  z-index: 2;
  pointer-events: none;
}

/* 右侧图例区域 */
.chart-legend-panel {
  position: relative;
  min-width: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 45px 15px 15px;
  overflow: hidden;
}

/* 图例列表 */
.chart-legend {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.blue-dot,
.red-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.blue-dot {
  background: #207cdb;
}

.red-dot {
  background: #eb5042;
}

.chart-tooltip {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  padding: 10px 14px;
  min-width: 150px;
  border-radius: 4px;
  background: rgba(0, 20, 45, 0.92);
  border: 1px solid rgba(50, 140, 220, 0.6);
  color: #fff;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tooltip-title {
  margin-bottom: 8px;
  color: #8dcaff;
}

.tooltip-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 5px;
}
</style>
