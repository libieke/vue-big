<template>
  <div
    ref="barChart"
    class="bar-line-chart"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script>
import echarts from "@/lib/echarts";

export default {
  name: "BarLineChart",

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

    width: {
      type: String,
      default: "100%",
    },

    height: {
      type: String,
      default: "100%",
    },

    // 每个像素期望展示的数据点数量
    pointsPerPixel: {
      type: Number,
      default: 1.5,
    },

    // 最大渲染数据点
    maxRenderPoints: {
      type: Number,
      default: 2000,
    },
  },

  data() {
    return {
      chart: null,
      resizeHandler: null,
      resizeTimer: null,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.initEcharts();
    });

    this.resizeHandler = () => {
      clearTimeout(this.resizeTimer);

      this.resizeTimer = setTimeout(() => {
        if (this.chart) {
          this.chart.resize();
          this.updateEcharts();
        }
      }, 150);
    };

    window.addEventListener("resize", this.resizeHandler);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandler);

    clearTimeout(this.resizeTimer);

    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },

  watch: {
    chartOptions: {
      handler() {
        this.$nextTick(() => {
          this.updateEcharts();
        });
      },
      deep: true,
    },
  },

  methods: {
    // 初始化图表，只执行一次
    initEcharts() {
      const chartDom = this.$refs.barChart;

      if (!chartDom) return;

      if (!this.chart) {
        this.chart = echarts.init(chartDom);
      }

      this.updateEcharts();
    },

    // 根据容器宽度计算渲染点数
    getMaxPoints() {
      const chartDom = this.$refs.barChart;

      const width = chartDom ? chartDom.clientWidth : 1200;

      const points = Math.floor(width * this.pointsPerPixel);

      return Math.max(300, Math.min(points, this.maxRenderPoints));
    },

    // 万级数据聚合
    aggregateData() {
      const { xData = [], yData = [], lineData = [] } = this.chartOptions || {};

      const length = Math.min(xData.length, yData.length, lineData.length);

      if (!length) {
        return {
          xData: [],
          yData: [],
          lineData: [],
        };
      }

      const maxPoints = this.getMaxPoints();

      // 数据量较少，直接使用原始数据
      if (length <= maxPoints) {
        return {
          xData: xData.slice(0, length),
          yData: yData.slice(0, length),
          lineData: lineData.slice(0, length),
        };
      }

      const bucketSize = Math.ceil(length / maxPoints);

      const result = {
        xData: [],
        yData: [],
        lineData: [],
      };

      for (let i = 0; i < length; i += bucketSize) {
        const end = Math.min(i + bucketSize, length);

        let barSum = 0;
        let lineSum = 0;
        let lineCount = 0;

        for (let j = i; j < end; j++) {
          const barValue = Number(yData[j]);
          const lineValue = Number(lineData[j]);

          if (Number.isFinite(barValue)) {
            barSum += barValue;
          }

          if (Number.isFinite(lineValue)) {
            lineSum += lineValue;
            lineCount++;
          }
        }

        // X轴使用当前区间第一个标签
        result.xData.push(xData[i]);

        // 柱状图：区间总报警次数
        result.yData.push(Number(barSum.toFixed(2)));

        // 折线图：区间平均报警占比
        result.lineData.push(
          lineCount ? Number((lineSum / lineCount).toFixed(2)) : null,
        );
      }

      return result;
    },

    // 更新图表，不重复初始化
    updateEcharts() {
      if (!this.chart) return;

      const { title = "", subtext = "" } = this.chartOptions || {};

      const { xData, yData, lineData } = this.aggregateData();

      const option = {
        animation: false,

        title: [
          {
            text: title,
            left: 0,
            top: 0,
            textStyle: {
              fontWeight: "500",
              fontSize: 24,
              color: "#FFFFFF",
            },
          },
          {
            subtext: subtext,
            left: "right",
            top: -10,
            subtextStyle: {
              color: "rgba(255,255,255,0.9)",
              fontSize: 22,
            },
          },
        ],

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          textStyle: {
            fontSize: 20,
            color: "#000",
          },
        },

        legend: {
          show: true,
          top: 5,
          textStyle: {
            color: "#fff",
            fontSize: 14,
          },
          data: ["报警次数(个)", "报警占比(%)"],
        },

        grid: {
          left: 15,
          top: "17%",
          bottom: 65,
          right: 15,
          containLabel: true,
        },

        // 支持鼠标滚轮缩放和底部滑块
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "filter",
          },
          {
            type: "slider",
            xAxisIndex: 0,
            height: 18,
            bottom: 10,
            borderColor: "transparent",
            textStyle: {
              color: "#6d7b8e",
            },
          },
        ],

        xAxis: {
          type: "category",
          boundaryGap: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#657387",
              width: 2,
            },
          },
          axisLabel: {
            color: "#6d7b8e",
            fontSize: 14,
            hideOverlap: true,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: xData,
        },

        yAxis: [
          {
            type: "value",
            show: true,
            scale: true,
            name: "报警次数",
            axisLine: {
              show: false,
            },
            alignTicks: true,
            position: "left",
            axisLabel: {
              color: "#6d7b8e",
              fontSize: 14,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                width: 1,
                color: "rgba(255,255,255,0.3)",
              },
            },
          },
          {
            type: "value",
            show: true,
            scale: true,
            name: "报警占比",
            position: "right",
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: "#6d7b8e",
              fontSize: 14,
              formatter: "{value}%",
            },
          },
        ],

        series: [
          {
            type: "bar",
            name: "报警次数(个)",
            yAxisIndex: 0,
            animation: false,
            large: true,
            largeThreshold: 500,
            barMaxWidth: 14,
            itemStyle: {
              color: "#207CDB",
            },
            data: yData,
          },
          {
            type: "line",
            name: "报警占比(%)",
            yAxisIndex: 1,
            smooth: false,
            showSymbol: false,
            sampling: "lttb",
            animation: false,
            lineStyle: {
              color: "#EB5042",
              width: 3,
              opacity: 1,
            },
            itemStyle: {
              color: "#EB5042",
            },
            data: lineData,
          },
        ],
      };

      // notMerge 避免旧数据残留
      this.chart.setOption(option, true);
    },
  },
};
</script>

<style scoped>
.bar-line-chart {
  min-width: 0;
  box-sizing: border-box;
}
</style>
