<template>
  <ContentTitle title="">
    <div class="agent-container padding-top-20">
      <div class="relative">
        <el-form
          ref="queryForm"
          class="search-form"
          size="medium"
          inline
          :model="listQuery"
        >
          <el-form-item
            v-for="(val, key, index) in listQueryFormModel"
            :key="index"
            :label="val.label"
            :prop="key"
          >
            <el-select
              v-if="val.type == 'select'"
              v-model="listQuery[key]"
              :placeholder="val.placeholder"
              :clearable="val.clearable ? val.clearable : true"
            >
              <el-option
                v-for="(item, optionIndex) in val.options"
                :key="optionIndex"
                :label="item[val.optionLable]"
                :value="item[val.optionValue]"
              />
            </el-select>
            <el-date-picker
              v-if="val.type == 'picker'"
              v-model="value"
              type="daterange"
              :placeholder="val.placeholder"
              range-separator="——"
              format="yyyy-dd"
              value-format="yyyy-dd"
              :picker-options="{
                disabledDate: (time) => {
                  return time.getTime() > Date.now() - 3600 * 1000 * 24;
                },
              }"
              @change="changeTime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleQuery"
              >查询</el-button
            >
            <el-button type="primary" size="medium" @click="outQuery"
              >数据导出</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="chartStyle">
        <BarChart
          :chartOptions="chartOptions"
          height="350px"
          style="margin-bottom: 10px"
        ></BarChart>
      </div>
      <div class="content-box">
        <div class="left-box">
          <custom-table
            :fetch-loading="listLoading"
            :data="list"
            :loading-text="loadingText"
            :table-column="tableColumn"
            :selection="false"
          >
          </custom-table>
        </div>
      </div>
    </div>
  </ContentTitle>
</template>

<script>
import ContentTitle from "@/components/ContentTitle/index";
import CustomTable from "@/components/CustomTable";
import BarChart from "@/components/Echart/barChart";
export default {
  components: {
    ContentTitle,
    CustomTable,
    BarChart,
  },
  data() {
    return {
      value: "",
      loadingText: "加载中...",
      list: [],
      listLoading: false,
      // 自定义Pagination的参数
      listQuery: {
        orderType: null,
        orderType1: null,
        orderType2: null,
        orderType4: null,
        startDate: null,
        endDate: null,
      },
      // 查询表单对象
      listQueryFormModel: {
        orderType: {
          type: "select",
          label: "工程",
          placeholder: "请选择工程",
          options: [
            {
              typeName: "全部",
              typeCode: null,
            },
            {
              typeName: "1",
              typeCode: 0,
            },
            {
              typeName: "2",
              typeCode: 1,
            },
          ],
          optionLable: "typeName",
          optionValue: "typeCode",
        },
        orderType1: {
          type: "select",
          label: "机型",
          placeholder: "请选择机型",
          options: [
            {
              typeName: "全部",
              typeCode: null,
            },
            {
              typeName: "1",
              typeCode: 0,
            },
            {
              typeName: "2",
              typeCode: 1,
            },
          ],
          optionLable: "typeName",
          optionValue: "typeCode",
        },
        orderType2: {
          type: "select",
          label: "机器编号",
          placeholder: "请选择机号",
          options: [
            {
              typeName: "全部",
              typeCode: null,
            },
            {
              typeName: "1",
              typeCode: 0,
            },
            {
              typeName: "2",
              typeCode: 1,
            },
          ],
          optionLable: "typeName",
          optionValue: "typeCode",
        },
        startDate: {
          type: "picker",
          label: "日期",
        },
        orderType4: {
          type: "select",
          label: "批次",
          placeholder: "请选择批次号",
          options: [
            {
              typeName: "全部",
              typeCode: null,
            },
            {
              typeName: "1",
              typeCode: 0,
            },
            {
              typeName: "2",
              typeCode: 1,
            },
          ],
          optionLable: "typeName",
          optionValue: "typeCode",
        },
      },
      // 根据接口和设计稿设置表头
      tableColumn: [
        {
          prop: "ranking",
          label: "排名",
        },
        {
          prop: "realName",
          label: "客户名称",
        },
        {
          prop: "compare",
          label: "较上周",
        },
        {
          prop: "salesVolume",
          label: "销售额(元)",
        },
      ],
      // echarts数据
      chartOptions: {
        yData: [],
        xData: [],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 搜索
    handleQuery() {
      this.listQuery.pageNum = 1;
    },
    getList() {
      // this.isShowCountry = true;
      this.list = [
        {
          ranking: "1",
          realName: "dsad",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "2",
          realName: "种植f户",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "3",
          realName: "打发",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "4",
          realName: "种植户",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "5",
          realName: "种植户",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "6",
          realName: "种植户",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "7",
          realName: "种植户",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "8",
          realName: "种植户",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "9",
          realName: "种植户",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "10",
          realName: "种植户",
          compare: "下降",
          salesVolume: "1234",
        },
      ];
      this.chartOptions.title = "生产计数";
      this.chartOptions.yData = [
        "20210126",
        "20210127",
        "20210128",
        "20210129",
        "20210130",
        "20210131",
        "20210201",
      ];
      this.chartOptions.xData = [
        "190828",
        "240898",
        "235073",
        "225906",
        "199583",
        "174498",
        "234296",
      ];
    },
    // 时间处理
    changeTime(e) {
      this.listQuery.startDate = e[0];
      this.listQuery.endDate = e[1];
    },
    // 数据导出
    outQuery() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        const fieldName = this.tableColumn.flatMap((item) => item.label);
        const filterVal = this.tableColumn.flatMap((item) => item.prop);
        const data = this.list.map((v) => filterVal.map((j) => v[j]));
        export_json_to_excel(fieldName, data, "用户列表");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chartStyle {
  width: 100%;
  height: 400px;
  margin-top: -10px;
  padding: 24px 20px;
  background: #00102a;
  border-radius: 16px 16px 16px 16px;
  border: 2px solid #003b7a;
}
.content-box {
  display: flex;
  margin-top: 24px;
  .left-box {
    height: 463px;
    padding: 24px;
    text-align: center;
    background: rgba(32, 124, 219, 0.1);
    border-radius: 16px 16px 16px 16px;
    border: 2px solid #003b7a;
    overflow: hidden;
  }
}
</style>
