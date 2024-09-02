<!-- 自定义表单 -->
<template>
  <el-table
    @mouseout="mouseout"
    @mouseover="mouseover"
    v-loading="fetchLoading && data.length == 0"
    :data="data"
    ref="table"
    stripe
    border
    :header-cell-style="{
      borderColor: '#003B7A',
      color: '#fff',
      height: '52px',
    }"
    :row-style="{
      height: '20px',
      background: '#000',
      borderColor: '#00539F',
      color: '#fff',
    }"
    :cell-style="{
      padding: '5px',
      borderColor: '#00539F',
      height: '50px',
    }"
    :show-summary="showSummary"
    :summary-method="getSummaries"
    :element-loading-text="loadingText"
    @selection-change="handleSelectionChange"
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
          <span v-if="item.formatter">{{
            item.formatter(
              scope.row,
              scope.column,
              scope.row[scope.column.property],
              scope.$index
            )
          }}</span>
          <span v-else>{{ scope.row[scope.column.property] }}</span>
        </span>
      </template>
    </el-table-column>
    <slot name="actionColumn" />
  </el-table>
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
  },
  data() {
    return {
      timer: null,
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
  created() {
    this.mouseover();
    this.mouseout();
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
    // 自动滚动
    mouseover() {
      clearInterval(this.timer);
    },
    mouseout() {
      this.autoScroll(false);
    },
    // 自动轮播效果
    autoScroll(init) {
      this.$nextTick(() => {
        const t = 50;
        const box = this.$el.querySelector(".el-table__body-wrapper");
        const content = this.$el.querySelector(".el-table__body");
        if (init) box.scrollTop = 0;
        this.timer = setInterval(() => {
          this.rollStart(box, content);
        }, t);
      });
    },
    rollStart(box, content) {
      if (box.scrollTop >= content.scrollHeight - box.offsetHeight) {
        // 如果已经滚动到最后一条数据，将滚动位置重置为0，实现无缝轮播的效果
        box.scrollTop = 0;
      } else {
        box.scrollTop++;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
