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
        <div class="right-box">
          <div class="right-item">
            <div class="item-box">
              <div class="item-num">0</div>
              <div class="item-text">OK总数</div>
            </div>
            <div class="item-box">
              <div class="item-num">0</div>
              <div class="item-text">NG总数</div>
            </div>
            <div class="item-box">
              <div class="item-num">0</div>
              <div class="item-text">OK总数总比例</div>
            </div>
            <div class="item-box">
              <div class="item-num">0</div>
              <div class="item-text">NG总数总比例</div>
            </div>
            <div v-if="isShowCountry" class="item-box">
              <div class="item-num">0</div>
              <div class="item-text">外观机返检数</div>
            </div>
          </div>
          <div v-if="!isShowCountry" class="btn-contro" @click="controlFn()">
            控制图
          </div>
        </div>
      </div>
    </div>
  </ContentTitle>
</template>

<script>
import ContentTitle from "@/components/ContentTitle/index";
import CustomTable from "@/components/CustomTable";
import BarChart from "@/components/Echart/barChart";
import * as API from "@/axios/common.js";
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
      isShowCountry: false, // 控制按钮限隐
      listLoading: false,
      // 自定义Pagination的参数
      hideOnSinglePage: false,
      listQuery: {
        pageNo: 0,
        pageSize: 0,
        startTime: "2024-09-05",
        endTime: "2024-09-06",
        deviceId: "TR_D300_117",
        listDeviceType: null,
        listDeviceVersion: null,
        listDeviceAssetNumber: null,
      },
      // 查询表单对象
      listQueryFormModel: {
        listDeviceType: {
          type: "select",
          label: "工程",
          placeholder: "请选择工程",
          options: [],
          optionLable: "name",
          optionValue: "id",
          show: true,
        },
        listDeviceVersion: {
          type: "select",
          label: "机型",
          placeholder: "请选择机型",
          options: [],
          optionLable: "version",
          optionValue: "version",
          show: true,
        },
        listDeviceAssetNumber: {
          type: "select",
          label: "机器编号",
          placeholder: "请选择机器编号",
          options: [],
          optionLable: "assetNumber",
          optionValue: "deviceId",
          show: true,
        },
        startDate: {
          type: "picker",
          label: "日期",
        },
      },
      // 根据接口和设计稿设置表头
      tableColumn: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "sumNum",
          label: "总数量",
        },
        {
          prop: "gpNum",
          label: "OK数量",
        },
        {
          prop: "ngNum",
          label: "NG数量",
        },
        {
          prop: "gpRate",
          label: "良品率",
        },
        {
          prop: "ngRate",
          label: "不良率",
        },
        {
          prop: "ngNum",
          label: "良品稼动率",
        },
        {
          prop: "purate",
          label: "生产稼动率",
        },
        {
          prop: "pmtbf",
          label: "MTBF",
        },
      ],
      chartOptions: {
        yData: [],
        xData: [],
      },
    };
  },
  created() {
    // this.listQuery.deviceId = this.$route.query.id; // 接受页面路由跳转参数
    // let id = this.listQuery.deviceId;
    this.getList();
    this.$nextTick(() => {
      this.getListDeviceType();
    });
    // if (id) {
    //   // this.editState = true;
    //   // this.topTitle = "编辑商品";
    //   // this.goodsId = id;
    //   // this.queryProxyInfo(id);
    // } else {
    //   this.getList(id);
    // }
  },
  methods: {
    // 搜索
    handleQuery() {
      this.listQuery.pageNum = 1;
    },
    // 工程查询项list
    getListDeviceType() {
      API.listDeviceType().then((res) => {
        if (res.code == 200) {
          this.listQueryFormModel.listDeviceType.options = res.data;
        }
      });
    },
    changeId(item) {
      // 查询机型列表
      let deviceTypeId = item.listDeviceType;
      let version = item.listDeviceVersion;
      if (!version) {
        API.listDeviceVersion({ deviceTypeId: deviceTypeId }).then((res) => {
          if (res.code == 200) {
            this.listQueryFormModel.listDeviceVersion.options = res.data;
          }
        });
      } else if (version) {
        // 查询机号列表
        API.listDeviceAssetNumber({
          deviceTypeId: deviceTypeId,
          version: version,
        }).then((res) => {
          if (res.code == 200) {
            this.listQueryFormModel.listDeviceAssetNumber.options = res.data;
          }
        });
      }
    },

    // 控制图
    controlFn() {},
    getList(id) {
      // 获取表格详情
      API.getProdInfo({
        ...this.listQuery,
      }).then((res) => {
        this.listLoading = true;
        if (res.code == "200") {
          this.list = res.data || [];
          this.listLoading = false;
        }
        this.listLoading = false;
      });

      this.chartOptions.title = "生产计数";
      this.chartOptions.subtext = "(个)";
      this.chartOptions.xData = [
        "+箔切",
        "+引线供给错误",
        "-箔切",
        "电解纸切1",
        "+箔切",
        "+引线供给错误",
        "-箔切",
        "电解纸切1",
      ];
      this.chartOptions.yData = [
        "134",
        "321",
        "323",
        "222",
        "145",
        "132",
        "132",
      ];
    },
    // 时间处理
    changeTime(e) {
      this.listQuery.startDate = e[0];
      this.listQuery.endDate = e[1];
    },
    // 数据导出
    outQuery() {
      // API.exportGetProdInfo({
      //   ...this.listQuery,
      // }).then((res) => {
      //   if (res.code == 200) {
      //     console.log("res :>> ", res);
      //   }
      // });
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
    height: 44px;
    margin-bottom: 18px;
    padding-right: 8px;
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
    width: 1488px;
    height: 463px;
    padding: 24px;
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
        height: 142px;
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
        .item-num {
          font-size: 36px;
          padding-bottom: 5px;
        }
        .item-text {
          font-size: 20px;
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
::v-deep .el-table {
  height: 410px !important;
}
</style>
