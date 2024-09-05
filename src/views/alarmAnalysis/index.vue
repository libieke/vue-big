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
            :label="val.show ? val.label : ''"
            :prop="key"
          >
            <el-input
              v-if="(val.type == 'input') & (batchShow == true)"
              v-model="listQuery[key]"
              maxlength="50"
              :placeholder="val.placeholder"
              clearable
            />
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
              v-if="(val.type == 'picker') & (dataShow == true)"
              v-model="value"
              type="daterange"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
              range-separator="—"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
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
        <div class="positonBtn">
          <el-radio-group
            v-model="radio1"
            size="medium"
            fill="#00D8F4"
            @input="changeTab"
          >
            <el-radio-button label="日期"></el-radio-button>
            <el-radio-button label="批次"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="chartStyle">
        <BLchart
          :chartOptions="chartOptions"
          height="350px"
          style="margin-bottom: 10px"
        ></BLchart>
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
import BLchart from "@/components/Echart/BLchart";
export default {
  components: {
    ContentTitle,
    CustomTable,
    BLchart,
  },
  data() {
    return {
      value: "",
      loadingText: "加载中...",
      list: [],
      listLoading: false,
      listQuery: {
        orderType: null,
        orderType1: null,
        orderType2: null,
        startDate: null,
        endDate: null,
        pici: null,
      },
      // tab
      radio1: "日期",
      dataShow: true,
      batchShow: false,
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
          show: true,
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
          show: true,
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
          show: true,
        },
        startDate: {
          type: "picker",
          label: "日期",
          show: true,
        },
        pici: {
          type: "input",
          label: "批次号",
          placeholder: "请输入批次号",
          show: false,
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
        title: "",
        subtext: "",
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
    // tab切换
    changeTab(e) {
      if (e === "日期") {
        this.batchShow = false;
        this.dataShow = true;
        this.listQueryFormModel.startDate.show = true;
        this.listQueryFormModel.pici.show = false;
      } else if (e === "批次") {
        this.dataShow = false;
        this.batchShow = true;
        this.listQueryFormModel.startDate.show = false;
        this.listQueryFormModel.pici.show = true;
      }
    },
    getList() {
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
      this.chartOptions.title = "报警次数(个)";
      this.chartOptions.subtext = "报警次数(%)";
      this.chartOptions.yData = ["21", "33", "22", "41", "12", "13", "14"];
      this.chartOptions.xData = [
        "190828",
        "240898",
        "235073",
        "225906",
        "199583",
        "174498",
        "234296",
      ];
      this.chartOptions.lineData = ["3", "6", "2", "0", "13", "11", "9"];
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
.agent-container {
  .relative {
    padding-right: 100px;
    height: 44px;
    margin-bottom: 18px;
    .positonBtn {
      position: absolute;
      display: flex;
      align-items: center;
      bottom: 40px;
      top: 19px;
      left: 46%;
      .tab-text {
        font-size: 20px;
        color: #ffffff;
        padding-right: 8px;
      }
    }
  }
}
::v-deep .el-form-item {
  &:nth-child(3) {
    margin-right: 180px !important;
  }
}
.chartStyle {
  width: 100%;
  height: 400px;
  // margin-top: -10px;
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
