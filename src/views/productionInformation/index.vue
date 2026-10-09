<template>
  <ContentTitle>
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
              @change="changeId(listQuery)"
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
                  return time.getTime() > Date.now();
                },
              }"
              @change="changeTime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleQuery">查询</el-button>
            <el-button type="primary" size="medium" @click="outQuery">数据导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="chartStyle">
        <div v-if="list.length > 0">
          <BarChart
            :chartOptions="chartOptions"
            height="350px"
            style="margin-bottom: 10px"
          ></BarChart>
        </div>
        <el-empty v-else :image="require('@/assets/images/empty.png')"></el-empty>
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
              <div class="item-num">{{ this.otherData.okNumL || 0 }}</div>
              <div class="item-text">OK总数</div>
            </div>
            <div class="item-box">
              <div class="item-num">{{ this.otherData.ngNum || 0 }}</div>
              <div class="item-text">NG总数</div>
            </div>
            <div class="item-box">
              <div class="item-num">{{ this.otherData.okRate || "NaN%" }}</div>
              <div class="item-text">OK总数总比例</div>
            </div>
            <div class="item-box">
              <div class="item-num">{{ this.otherData.ngRate || "NaN%" }}</div>
              <div class="item-text">NG总数总比例</div>
            </div>
            <div v-if="!isShowCountry" class="item-box">
              <div class="item-num">{{ this.otherData.fjNum || 0 }}</div>
              <div class="item-text">外观机返检数</div>
            </div>
          </div>
          <div v-if="ngObject != 1" class="btn-contro" @click="controlFn()">控制图</div>
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
      // showEmpty: true,
      value: "",
      loadingText: "加载中...",
      list: [],
      otherData: {
        okNumL: "",
        ngNum: "",
        fjNum: "",
        okRate: "",
        ngRate: "",
      },
      ngObject: {},
      isShowCountry: false, // 控制按钮限隐
      listLoading: false,
      // 自定义Pagination的参数
      hideOnSinglePage: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        startTime: null,
        endTime: null,
        deviceId: null,
        typeId: null,
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
    this.listQuery.deviceId = this.$route.query.deviceId;
    if (this.listQuery.deviceId) {
      this.getList();
      this.getAgeing();
    }
    this.getListDeviceType()
      .then(() => {
        if (this.listQuery.deviceId) {
          return null;
        }
        const firstType = this.listQueryFormModel.listDeviceType.options[0];
        if (!firstType) {
          return null;
        }
        this.listQuery.listDeviceType = firstType.id;
        this.listQuery.typeId = firstType.id;
        return this.changeId(this.listQuery).then(() => this.getList());
      })
      .catch(() => {});
  },
  computed: {
    listQueryFn() {
      return JSON.parse(JSON.stringify(this.listQuery));
    },
  },
  watch: {
    listQueryFn: {
      handler(newVal, oldVal) {
        let newRes = newVal.typeId;
        let oldRes = oldVal.typeId;
        if (newRes != oldRes) {
          this.listQuery.listDeviceVersion = "";
          this.listQuery.listDeviceAssetNumber = "";
        }
      },
      deep: true,
    },
  },
  methods: {
    handleQuery() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    getListDeviceType() {
      return API.listDeviceType().then((res) => {
        if (res.code == 200) {
          this.listQueryFormModel.listDeviceType.options = res.data;
        }
        return this.listQueryFormModel.listDeviceType.options;
      });
    },
    changeId(item) {
      this.listQuery.typeId = item.listDeviceType;
      let version = item.listDeviceVersion;
      const versionRequest = API.listDeviceVersion({
        deviceTypeId: this.listQuery.typeId,
      }).then((res) => {
        if (res.code == 200) {
          this.listQueryFormModel.listDeviceVersion.options = res.data;
        }
      });
      const assetRequest = API.listDeviceAssetNumber({
        deviceTypeId: this.listQuery.typeId,
        version: version,
      }).then((res) => {
        if (res.code == 200) {
          this.listQueryFormModel.listDeviceAssetNumber.options = res.data;
          const deviceId =
            item.listDeviceAssetNumber ||
            (res.data && res.data[0] && res.data[0].deviceId);
          if (deviceId) {
            this.listQuery.listDeviceAssetNumber = deviceId;
            this.listQuery.deviceId = deviceId;
          }
        }
      });
      return Promise.all([versionRequest, assetRequest]);
    },
    // 控制图
    controlFn() {},
    getList() {
      this.listLoading = true;
      return API.getProdInfo({
        ...this.listQuery,
      }).then((res) => {
        if (res.code == "200") {
          const data = Array.isArray(res.data) ? res.data : [];
          this.list = data;
          const summary = data.reduce(
            (result, item) => {
              result.sumNum += Number(item.sumNum) || 0;
              result.okNumL += Number(item.gpNum) || 0;
              result.ngNum += Number(item.ngNum) || 0;
              result.fjNum += Number(item.fjNum) || 0;
              return result;
            },
            { sumNum: 0, okNumL: 0, ngNum: 0, fjNum: 0 }
          );
          this.otherData.okNumL = summary.okNumL;
          this.otherData.ngNum = summary.ngNum;
          this.otherData.fjNum = summary.fjNum;
          this.otherData.okRate = summary.sumNum
            ? `${((summary.okNumL / summary.sumNum) * 100).toFixed(2)}%`
            : "0.00%";
          this.otherData.ngRate = summary.sumNum
            ? `${((summary.ngNum / summary.sumNum) * 100).toFixed(2)}%`
            : "0.00%";
          this.chartOptions.title = "生产计数";
          this.chartOptions.subtext = "(个)";
          this.chartOptions.xData = data.map((item) => {
            return item.date;
          });
          this.chartOptions.yData = data.map((item) => {
            return item.sumNum;
          });
        }
      }).catch(() => {}).then(() => {
        this.listLoading = false;
      });
    },
    getAgeing() {
      API.getAgeing().then((res) => {
        if (res.code == 200) {
          this.ngObject = res.data;
        }
      });
    },
    changeTime(e) {
      this.listQuery.startTime = e[0];
      this.listQuery.endTime = e[1];
    },
    outQuery() {
      API.exportGetProdInfo({
        ...this.listQuery,
      })
        .then((res) => {
          let fileName = decodeURIComponent(
            res.headers["content-disposition"].split("'")[2]
          );
          let url = window.URL.createObjectURL(
            new Blob([res.data], { type: "application/vnd.xlsx" })
          );
          let a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.setAttribute("download", `${fileName}`);
          document.body.appendChild(a);
          a.click();
          url = window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          this.$message.error("导出失败");
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
::v-deep .el-empty__description p {
  font-size: 22px;
}
</style>
