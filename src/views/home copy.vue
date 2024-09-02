<template>
  <div>
      <el-table :data="tableData" size="mini" fit border  highlight-current-row 
        ref="multipleTable"  stripe :header-cell-style=" 
          {background:'rgba(249,253,255,1)'}"
          style="width: 100%;min-height: 55vh;"
          :row-style="{'font-size': '12px',color: '#212121'}"
          @selection-change="rowCheckAllChange"
          @sort-change="handleSort"
          @filter-change="filterHandler"
          @row-click="handleRowClick">
          <!-- 表头多选项 -->
          <el-table-column style="background:#E6F7FF;"
              type="selection"
              fixed="left"
              width="40">
          </el-table-column> 
          <el-table-column v-for="(th, key) in tableHeader"
              :key="key"
              :prop="th.prop"
              :label="th.label"
              :fixed="th.fixed"
              :sortable="th.sortable=='custom'?'custom':(th.sortable?true:false)"
              :filters="th.filters?th.filters:null"
              :column-key="th.columnKey"
              :filtered-value="th.filteredValue?th.filteredValue:null"
              :filter-multiple="th.filterMultiple"
              :min-width="th.minWidth" align="center">
              <template slot-scope="scope">
                  <!-- 自定义操作按钮项 -->
                  <slot :name="th.prop"  v-if="th.slot" :row="scope.row" 
                    :index="scope.$index"></slot>
                 
                  <el-tooltip v-else-if="th.clickFun" placement="bottom">
                      <div slot="content">{{ scope.row[th.prop] }}</div>
                      <!-- 点击跳转详情 -->
                      <span  style="color:#1890ff;cursor: pointer;" 
                           @click="toDetail(scope.row)" @click.stop>
                          {{ scope.row[th.prop] || '-' }}
                      </span>
                  </el-tooltip>
                  <span v-else>{{ scope.row[th.prop] || '-' }}</span>
              </template>
          </el-table-column>
      </el-table>
  </div>
</template>

<script>
// 非父子组件通信
import VueEvent from '@/VueEvent/VueEvent.js'

export default {
  name: 'common-dynamic-table',
  components: {  },
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 表头数据
    tableHeader: {
      type: Array,
      default: function () {
        return []
      }
    },
    pageParams:{
      type: Object,
      default: function () {
        return {
            page:1,
            limit:20,
            total:0
        }
      }
    },
  },
  data() {
      return{ }
  },
  methods: {
      // 跳转到详情
      toDetail(row) {
          VueEvent.$emit('toChildDetail', row)
      },
      // 排序事件
      handleSort (sort) {
          this.$emit('sort-events', sort)
      },
      // 筛选事件
      filterHandler (filters) {
          this.$emit('filter-events', filters)
      },
      // 某一行被点击
      handleRowClick (row) {
          this.$emit('click-events', row)
      },
      //   复选框勾选
      rowCheckAllChange(val) {
          this.$emit('rowCheckAllChange', val)
      },
      // 分页
      handleSizeChange(size) {
          this.$emit('handleSizeChange', size)
      },
      pageCurrentChange(page) {
          this.$emit('pageCurrentChange', page)
      },
  }
}
</script>