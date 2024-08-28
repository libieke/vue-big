<!-- 自定义表单 -->
<template>
  <el-table
    v-loading="fetchLoading && data.length == 0"
    :data="data"
    border
    ref="table"
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
  created() {},
  methods: {
    handleSelectionChange(val) {
      if (this.selection) {
        this.$emit("selectionChange", val);
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-table__header-wrapper {
  .has-gutter {
    color: #1d2129;
    th {
      background: #fcfcfc;
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
