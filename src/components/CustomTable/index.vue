<!-- 自定义表单 -->
<template>
  <div class="tablx-box">
    <el-table
      v-loading="fetchLoading && data.length == 0"
      class="table"
      :data="data"
      ref="tableScroll"
      stripe
      border
      :max-height="maxHeight"
      :header-cell-style="{
        borderColor: '#003B7A',
        color: '#fff',
        height: '54px',
      }"
      :row-style="{
        color: '#fff',
      }"
      :cell-style="{
        padding: '5px',
        height: '52px',
        borderColor: '#00539F',
      }"
      row-class-name="tableRowClassName"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      :element-loading-text="loadingText"
      @selection-change="handleSelectionChange"
      @mouseenter.native="autoScroll(true)"
      @mouseleave.native="autoScroll(false)"
    >
      <el-table-column
        v-if="selection"
        type="selection"
        align="center"
        width="55"
      />
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="item.key ? item.key : index"
        align="center"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable"
        :width="item.width ? item.width : null"
      >
        <template slot-scope="scope">
          <span
            v-if="item.colCustomDemo"
            v-html="
              item.colCustomDemo({
                column: scope.column,
                row: scope.row,
                rowIndex: scope.$index,
              })
            "
          />
          <span v-else>
            <span v-if="item.formatter"
              >{{
                item.formatter(
                  scope.row,
                  scope.column,
                  scope.row[scope.column.property],
                  scope.$index
                )
              }}
            </span>
            <span v-else>{{ scope.row[scope.column.property] }} </span>
          </span>
        </template>
      </el-table-column>
      <slot name="actionColumn" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CustomTable",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    fetchLoading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: "加载中...",
    },
    tableColumn: {
      type: Array,
      default: () => [],
    },
    selection: {
      type: Boolean,
      default: false,
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    getSummaries: {
      type: Function,
    },
    maxHeight: {
      type: String,
      default: "410px",
    },
  },
  data() {
    return {
      scrolltimer: null,
      // data: this.data,
    };
  },
  computed: {
    tableTitle() {
      if (!this.data || this.data.length === 0) return [];
      const titles =
        this.tableColumn && this.tableColumn.length > 0
          ? this.tableColumn
          : (this.data &&
              this.data.length > 0 &&
              Object.keys(this.data[0]).map((item) => {
                return {
                  prop: item,
                  label: item,
                };
              })) ||
            [];
      return titles;
    },
  },
  mounted() {
    this.autoScroll();
  },
  beforeDestroy() {
    this.autoScroll(true);
  },
  methods: {
    handleSelectionChange(val) {
      if (this.selection) {
        this.$emit("selectionChange", val);
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return "el-table__row--striped";
      }
    },
    // 自动轮播效果
    autoScroll(stop) {
      const table = this.$refs.tableScroll;
      // 拿到表格中承载数据的div元素
      const divData = table.$refs.bodyWrapper;
      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      if (stop) {
        //再通过事件监听，监听到 组件销毁 后，再执行关闭计时器。
        window.clearInterval(this.scrolltimer);
      } else {
        this.scrolltimer = window.setInterval(() => {
          // 元素自增距离顶部1像素
          divData.scrollTop += 1;
          // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
          if (
            divData.clientHeight + divData.scrollTop >=
            divData.scrollHeight
          ) {
            // 重置table距离顶部距离
            divData.scrollTop = 0;
            this.data;
            // this.data = [...this.data, ...this.data];
          }
        }, 45); // 滚动速度
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.test-div {
  animation: fadeOut 500ms linear;
}

@keyframes scroll {
}
::v-deep .el-table__header-wrapper {
  .has-gutter {
    color: #1d2129;
    th {
      background: #003b7a;
    }
    tr {
      background: #003b7a;
    }
  }
}

::v-deep .el-table__body {
  width: 100% !important;
}
::v-deep .el-table__footer {
  width: 100% !important;
}
::v-deep .el-table__header {
  width: 100% !important;
}

::v-deep .el-table__empty-block {
  width: 100% !important;
}

::v-deep .cell.el-tooltip {
  width: 100% !important;
}

::v-deep .el-table__body tr,
::v-deep .el-table__body td {
  padding: 0;
  height: 34px;
}
// 显示的颜色
::v-deep .el-table__body tr.el-table__row--striped td {
  background-color: #043272 !important;
}
::v-deep .el-table__row {
  background: #031a3c !important;
}

::v-deep .el-table__body tr:hover > td {
  background-color: #3d5e8d !important;
}

::v-deep .el-table--border,
.el-table--group {
  border: 1px solid #003b7a;
}

// 隐藏滚动条
::v-deep .el-table__body-wrapper {
  &::-webkit-scrollbar {
    // 整个滚动条
    width: 0 !important; // 纵向滚动条的宽度
    background: transparent;
    border: none;
  }

  &::-webkit-scrollbar-track {
    // 滚动条轨道
    border: none !important;
  }
  /* 滚动条轨道内部空白区域样式 */
  &::-webkit-scrollbar-track {
    background-color: transparent; /* 设置轨道背景色为浅灰色 */
  }
}
</style>
