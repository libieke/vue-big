<template>
  <div class="virtual-table">
    <!-- 表头 -->
    <div class="table-header">
      <!-- 第一列：序号 / ID -->
      <div
        v-if="showIndex"
        class="table-cell header-cell index-cell"
        :style="getIndexColumnStyle()"
      >
        {{ indexType === "id" ? indexLabel : indexLabel }}
      </div>

      <!-- 业务表头 -->
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
      v-loading="listLoading"
      :element-loading-text="loadingText"
      element-loading-background="rgba(3, 26, 60, 0.65)"
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
          :class="{
            'row-odd': item.index % 2 !== 0,
          }"
          :style="{
            height: rowHeight + 'px',
            transform: 'translateY(' + item.top + 'px)',
          }"
        >
          <!-- 第一列：序号 / ID -->
          <div
            v-if="showIndex"
            class="table-cell index-cell"
            :style="getIndexColumnStyle()"
          >
            {{ getIndexValue(item) }}
          </div>

          <!-- 业务数据列 -->
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
              :index="item.index"
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

      <span v-if="listLoading">
        {{ loadingText }}
      </span>

      <span v-else>
        {{ isPaused ? "鼠标悬停，已暂停" : "自动滚动中" }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomTable",

  props: {
    // 表头配置
    columns: {
      type: Array,
      default: () => [],
    },

    // 表格数据
    data: {
      type: Array,
      default: () => [],
    },

    // 加载状态
    listLoading: {
      type: Boolean,
      default: false,
    },

    // 加载提示
    loadingText: {
      type: String,
      default: "加载中...",
    },

    // 是否显示第一列
    showIndex: {
      type: Boolean,
      default: true,
    },

    // 第一列类型：index 或 id
    indexType: {
      type: String,
      default: "index",
      validator(value) {
        return ["index", "id"].includes(value);
      },
    },

    // ID 对应的数据字段
    indexProp: {
      type: String,
      default: "id",
    },

    // 第一列标题
    indexLabel: {
      type: String,
      default: "序号",
    },

    // 第一列宽度
    indexWidth: {
      type: Number,
      default: 70,
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

    // 可视区域数据
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
    // 数据更新，回到顶部
    data() {
      this.resetScroll();
    },

    // 加载结束后重新计算时间
    listLoading(value) {
      if (!value) {
        this.lastTime = 0;
      } else {
        this.lastTime = 0;
      }
    },

    // 自动滚动开关
    autoScroll(value) {
      if (value) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    },

    // 滚动速度变化
    speed() {
      this.lastTime = 0;
    },

    // 表格高度变化
    height() {
      this.lastTime = 0;
    },

    // 行高变化
    rowHeight() {
      this.resetScroll();
    },
  },

  mounted() {
    this.startAnimation();
  },

  beforeDestroy() {
    this.stopAnimation();
  },

  methods: {
    // 获取行唯一标识
    getRowKey(row, index) {
      const value = row && row[this.rowKey];

      return value !== undefined && value !== null ? value : index;
    },

    // 获取第一列样式
    getIndexColumnStyle() {
      return {
        width: this.indexWidth + "px",
        flex: "0 0 " + this.indexWidth + "px",
        textAlign: "center",
      };
    },

    // 获取第一列值
    getIndexValue(item) {
      if (this.indexType === "id") {
        const value = item.row && item.row[this.indexProp];

        return value === undefined || value === null ? "--" : value;
      }

      return item.index + 1;
    },

    // 列宽样式
    getColumnStyle(column) {
      const width = column.width || 150;

      return {
        width: typeof width === "number" ? width + "px" : width,
        flex: "1 1 " + (typeof width === "number" ? width + "px" : width),
        textAlign: column.align || "center",
      };
    },

    // 获取单元格内容
    getCellValue(row, column) {
      const value = row[column.prop];

      return value === undefined || value === null ? "" : String(value);
    },

    // 格式化单元格
    formatCell(row, column) {
      const value = row[column.prop];

      if (typeof column.formatter === "function") {
        return column.formatter(row, value);
      }

      return value === undefined || value === null ? "--" : value;
    },

    // 滚动同步
    handleScroll(event) {
      const body = this.$refs.scrollBody;
      if (!body) return;

      this.scrollTop = body.scrollTop;
    },

    // 鼠标进入
    pauseScroll() {
      this.isPaused = true;
    },

    // 鼠标离开
    resumeScroll() {
      this.isPaused = false;
      this.lastTime = 0;
    },

    // 数据更新回到顶部
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
      if (this.animationId) return;

      const animate = (timestamp) => {
        this.animationId = requestAnimationFrame(animate);

        const body = this.$refs.scrollBody;

        if (
          !body ||
          !this.autoScroll ||
          this.isPaused ||
          this.listLoading ||
          this.data.length === 0
        ) {
          this.lastTime = 0;
          return;
        }

        if (!this.lastTime) {
          this.lastTime = timestamp;
          return;
        }

        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // speed 单位：像素/秒
        const distance = (this.speed * delta) / 1000;

        const maxScrollTop = body.scrollHeight - body.clientHeight;

        if (maxScrollTop <= 0) return;

        if (body.scrollTop >= maxScrollTop - 1) {
          body.scrollTop = 0;
        } else {
          body.scrollTop += distance;
        }

        this.scrollTop = body.scrollTop;
      };

      this.animationId = requestAnimationFrame(animate);
    },

    // 停止滚动
    stopAnimation() {
      if (this.animationId !== null) {
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

.table-row.row-odd {
  background: rgba(4, 50, 114, 0.45);
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

.index-cell {
  border-right: 1px solid rgba(0, 110, 200, 0.3);
  color: #00d8f4;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  padding: 6px 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
