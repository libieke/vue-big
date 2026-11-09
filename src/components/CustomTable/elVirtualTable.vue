<template>
  <div class="virtual-table">
    <!-- 表头：保持父页面传入的 columns 不变 -->
    <div class="table-header">
      <div
        v-for="(column, index) in columns"
        :key="column.prop || index"
        class="table-cell header-cell"
        :style="getColumnStyle(column)"
      >
        {{ column.label }}
      </div>
    </div>

    <!-- 虚拟滚动区域 -->
    <div
      ref="scrollBody"
      class="table-body"
      :style="{ height: height + 'px' }"
      @scroll="handleScroll"
      @mouseenter="pauseScroll"
      @mouseleave="resumeScroll"
    >
      <!-- 总高度占位 -->
      <div
        class="table-spacer"
        :style="{
          height: data.length * rowHeight + 'px',
        }"
      >
        <!-- 可视区域 -->
        <div
          v-for="item in visibleRows"
          :key="getRowKey(item.row, item.index)"
          class="table-row"
          :style="{
            height: rowHeight + 'px',
            transform: 'translateY(' + item.top + 'px)',
          }"
        >
          <div
            v-for="(column, colIndex) in columns"
            :key="column.prop || colIndex"
            class="table-cell"
            :style="getColumnStyle(column)"
            :title="getCellValue(item.row, column)"
          >
            <slot
              :name="'column-' + column.prop"
              :row="item.row"
              :value="item.row[column.prop]"
            >
              {{ formatCell(item.row, column) }}
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- 状态 -->
    <div class="table-footer">
      <span>数据总数：{{ data.length }}</span>
      <span>
        {{ isPaused ? "鼠标悬停，已暂停" : "自动滚动中" }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomTable",

  props: {
    // 父页面表头
    columns: {
      type: Array,
      default: () => [],
    },

    // 父页面接口数据
    data: {
      type: Array,
      default: () => [],
    },

    // 表格高度
    height: {
      type: Number,
      default: 400,
    },

    // 行高
    rowHeight: {
      type: Number,
      default: 42,
    },

    // 滚动速度 px/s
    speed: {
      type: Number,
      default: 30,
    },

    // 缓冲行数
    buffer: {
      type: Number,
      default: 8,
    },

    // 自动滚动
    autoScroll: {
      type: Boolean,
      default: true,
    },

    // 唯一标识
    rowKey: {
      type: String,
      default: "id",
    },
  },

  data() {
    return {
      scrollTop: 0,
      isPaused: false,
      animationId: null,
      lastTime: 0,
    };
  },

  computed: {
    // 起始行
    startIndex() {
      return Math.max(
        0,
        Math.floor(this.scrollTop / this.rowHeight) - this.buffer,
      );
    },

    // 结束行
    endIndex() {
      const visibleCount = Math.ceil(this.height / this.rowHeight);

      return Math.min(
        this.data.length,
        this.startIndex + visibleCount + this.buffer * 2,
      );
    },

    // 仅渲染可视区域
    visibleRows() {
      const result = [];

      for (let i = this.startIndex; i < this.endIndex; i++) {
        result.push({
          row: this.data[i],
          index: i,
          top: i * this.rowHeight,
        });
      }

      return result;
    },
  },

  watch: {
    // 接口重新返回数据时，从第一行开始
    data() {
      this.resetScroll();
    },

    autoScroll(value) {
      if (value) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    },

    speed() {
      this.lastTime = 0;
    },
  },

  mounted() {
    this.startAnimation();
  },

  beforeDestroy() {
    this.stopAnimation();
  },

  methods: {
    getRowKey(row, index) {
      const value = row && row[this.rowKey];

      return value !== undefined && value !== null ? value : index;
    },

    getColumnStyle(column) {
      const width = column.width || 150;

      return {
        width: typeof width === "number" ? width + "px" : width,
        flex: "1 1 " + (typeof width === "number" ? width + "px" : width),
        textAlign: column.align || "center",
      };
    },

    getCellValue(row, column) {
      const value = row[column.prop];

      return value === undefined || value === null ? "" : String(value);
    },

    formatCell(row, column) {
      const value = row[column.prop];

      if (typeof column.formatter === "function") {
        return column.formatter(row, value);
      }

      return value === undefined || value === null ? "--" : value;
    },

    // 滚动同步
    handleScroll(event) {
      this.scrollTop = event.target.scrollTop;
    },

    // 鼠标进入表格
    pauseScroll() {
      this.isPaused = true;
      this.lastTime = 0;
    },

    // 鼠标离开表格
    resumeScroll() {
      this.isPaused = false;
      this.lastTime = 0;
    },

    // 数据更新，回到顶部
    resetScroll() {
      this.$nextTick(() => {
        const body = this.$refs.scrollBody;

        if (body) {
          body.scrollTop = 0;
          this.scrollTop = 0;
        }

        this.lastTime = 0;
      });
    },

    // 开始滚动
    startAnimation() {
      if (this.animationId || !this.autoScroll) return;

      const animate = (time) => {
        if (!this.autoScroll) {
          this.animationId = null;
          return;
        }

        const body = this.$refs.scrollBody;

        if (body && !this.isPaused) {
          if (this.lastTime) {
            const delta = Math.min(time - this.lastTime, 50);

            const maxScroll = body.scrollHeight - body.clientHeight;

            if (maxScroll > 0) {
              let nextTop = body.scrollTop + (this.speed * delta) / 1000;

              // 到底后回到顶部
              if (nextTop >= maxScroll) {
                nextTop = 0;
              }

              body.scrollTop = nextTop;
              this.scrollTop = nextTop;
            }
          }

          this.lastTime = time;
        } else {
          this.lastTime = 0;
        }

        this.animationId = requestAnimationFrame(animate);
      };

      this.animationId = requestAnimationFrame(animate);
    },

    // 停止滚动
    stopAnimation() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      this.lastTime = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.virtual-table {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #fff;
  font-size: 14px;
  box-sizing: border-box;
}

.table-header,
.table-row {
  display: flex;
  width: max-content;
  min-width: 100%;
}

.table-header {
  height: 42px;
  background: rgba(0, 91, 180, 0.35);
  border-bottom: 1px solid #07539a;
}

.table-body {
  width: 100%;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: #176bb1 transparent;
}

.table-spacer {
  position: relative;
  min-width: 100%;
}

.table-row {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 48, 100, 0.15);
  border-bottom: 1px solid rgba(0, 110, 200, 0.2);
  box-sizing: border-box;
  transition: background 0.15s ease;
}

.table-row:hover {
  background: rgba(128, 128, 128, 0.4);
}

.table-cell {
  flex-shrink: 0;
  height: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.header-cell {
  font-weight: bold;
  color: #fff;
  background: rgba(0, 75, 150, 0.3);
}

.table-footer {
  display: flex;
  justify-content: space-between;
  padding: 6px 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
