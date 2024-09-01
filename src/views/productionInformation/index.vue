<template>
  <ContentTitle title="">
    <div class="agent-container padding-top-20">
      <el-form
        ref="queryForm"
        class="search-form"
        size="small"
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
          <el-button type="primary" size="mini" @click="handleQuery"
            >查询</el-button
          >
          <el-button type="primary" size="mini" @click="outQuery"
            >数据导出</el-button
          >
        </el-form-item>
      </el-form>
      <BarChart
        :chartOptions="chartOptions"
        height="400px"
        style="margin-bottom: 10px"
      ></BarChart>
      <div class="content-box">
        <div class="left-box">
          <div class="table-box">
            <custom-table
              :fetch-loading="listLoading"
              :data="list"
              :loading-text="loadingText"
              :table-column="tableColumn"
              :selection="false"
            >
            </custom-table>
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="listQuery.pageNum"
              :limit.sync="listQuery.pageSize"
              :hide-on-single-page="hideOnSinglePage"
              @pagination="getList"
            />
          </div>
        </div>
        <div class="right-box">
          <div class="right-item">
            <div class="item-box" v-for="item in 4">
              <div class="item-num">0</div>
              <div class="item-text">weq</div>
            </div>
          </div>
          <div class="btn-contro" @click="controlFn()">控制图</div>
        </div>
      </div>
    </div>
  </ContentTitle>
</template>

<script>
import ContentTitle from "@/components/ContentTitle/index";
import CustomTable from "@/components/CustomTable";
import Pagination from "@/components/Pagination";
import BarChart from "@/components/Echart/barChart";
export default {
  components: {
    ContentTitle,
    CustomTable,
    Pagination,
    BarChart,
  },
  data() {
    return {
      value: "",
      loadingText: "加载中...",
      list: [],
      listLoading: false,
      // 自定义Pagination的参数
      total: 10,
      hideOnSinglePage: false,
      listQuery: {
        pageNum: 1, // pageNum
        pageSize: 10, // pageSize
        orderType: null,
        orderType1: null,
        orderType2: null,
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
          // placeholder: "请选择年份",
        },
      },
      // 根据接口和设计稿设置表头
      // tableColumn: [
      //   {
      //     prop: "date",
      //     label: "年份",
      //   },
      //   {
      //     prop: "orderType",
      //     label: "机型",
      //   },
      //   {
      //     prop: "orderType1",
      //     label: "编号",
      //   },
      //   {
      //     prop: "orderType2",
      //     label: "工程",
      //   },
      // ],

      // 图表
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
    console.log("this. :>> ", this.chartOptions);
  },
  methods: {
    // 搜索
    handleQuery() {
      this.listQuery.pageNum = 1;
    },
    // 控制图
    controlFn() {},
    getList() {
      this.list = [
        {
          ranking: "1",
          realName: "种植户",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "2",
          realName: "种植户",
          compare: "下降",
          salesVolume: "1234",
        },
        {
          ranking: "3",
          realName: "种植户",
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
.agent-container {
  .relative {
    padding-right: 100px;

    .positonBtn {
      position: absolute;
      right: 0;
      top: 2px;
    }
  }
}
.content-box {
  display: flex;
  .left-box {
    width: 1488px;
    height: 463px;
    text-align: center;
    background: rgba(32, 124, 219, 0.1);
    border-radius: 16px 16px 16px 16px;
    border: 2px solid #003b7a;
    overflow: hidden;
  }
  .right-box {
    width: 324px;
    margin-left: 25px;
    .right-item {
      display: flex;
      flex-wrap: wrap;

      .item-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 148px;
        height: 160px;
        font-size: 36px;
        color: #ffffff;
        background: rgba(32, 124, 219, 0.1);
        border-radius: 16px 16px 16px 16px;
        border: 2px solid #003b7a;
        &:nth-child(odd) {
          margin-right: 24px;
        }
        &:nth-child(n + 3) {
          margin-top: 18px;
        }
        .item-text {
          font-size: 22px;
          color: #ffffff;
          opacity: 0.6;
        }
      }
    }
    .btn-contro {
      width: 168px;
      height: 58px;
      text-align: center;
      line-height: 58px;
      color: #ffffff;
      margin: 58px auto 0;
      background: #1266b9;
      border-radius: 8px 8px 8px 8px;
    }
  }
}
</style>
