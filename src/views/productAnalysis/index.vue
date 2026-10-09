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
            <el-autocomplete
              v-if="(val.type == 'input') & (batchShow == true)"
              v-model="listQuery[key]"
              :placeholder="val.placeholder"
              value-key="patchNo"
              :fetch-suggestions="querySearchAsync"
              @input="loadAll"
              @select="handleSelect"
              clearable
            />
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
          v-if="this.chartOptions.xData.length > 0"
          :chartOptions="chartOptions"
          height="350px"
          style="margin-bottom: 10px"
        ></BLchart>
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
            :sort="sortShow"
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
        </div>
      </div>
    </div>
  </ContentTitle>
</template>

<script>
import ContentTitle from "@/components/ContentTitle/index";
import CustomTable from "@/components/CustomTable";
import BLchart from "@/components/Echart/BLchart";
import * as API from "@/axios/common.js";

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
      otherData: {
        okNumL: "",
        ngNum: "",
        fjNum: "",
        okRate: "",
        ngRate: "",
      },
      sortShow: false,
      listLoading: false,
      // 自定义Pagination的参数
      listQuery: {
        deviceId: null,
        typeId: null,
        listDeviceType: null,
        listDeviceVersion: null,
        listDeviceAssetNumber: null,
        startTime: null,
        endTime: null,
        patchNo: null,
      },
      isShowCountry: false, // 控制按钮限隐
      // tab
      radio1: "日期",
      dataShow: true,
      batchShow: false,
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
          show: true,
        },
        patchNo: {
          type: "input",
          label: "批次号",
          placeholder: "请输入批次号",
          show: false,
        },
      },
      restaurants: [],
      // 根据接口和设计稿设置表头
      tableColumn: [
        {
          prop: "context",
          label: "不良项目",
        },
        {
          prop: "num",
          label: "数量",
        },
        {
          prop: "ngRate",
          label: "比例",
        },
      ],
      // echarts数据
      chartOptions: {
        yData: [],
        xData: [],
        lineData: [],
        title: "",
        subtext: "",
      },
    };
  },
  created() {
    this.loadInitialData();
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
    loadInitialData() {
      return this.getListDeviceType()
        .then(() => {
          const firstType = this.listQueryFormModel.listDeviceType.options[0];
          if (!firstType) {
            return null;
          }
          this.listQuery.listDeviceType = firstType.id;
          this.listQuery.typeId = firstType.id;
          return this.changeId(this.listQuery);
        })
        .then(() => this.getList())
        .catch(() => {});
    },
    handleQuery() {
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
    changeTab(e) {
      if (e === "日期") {
        this.batchShow = false;
        this.dataShow = true;
        this.listQueryFormModel.startDate.show = true;
        this.listQueryFormModel.patchNo.show = false;
        this.listQuery.patchNo = "";
      } else if (e === "批次") {
        this.dataShow = false;
        this.batchShow = true;
        this.listQueryFormModel.startDate.show = false;
        this.listQueryFormModel.patchNo.show = true;
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
    },
    getList() {
      this.listLoading = true;
      return API.getProdInfoNg({
        ...this.listQuery,
      }).then((res) => {
        if (res.code == 200) {
          this.list = res.data.nkNgEnumRespList || [];
          Object.assign(this.otherData, res.data);
          // 图表

          this.chartOptions.title = "报警次数(个)";
          this.chartOptions.subtext = "报警次数(%)";
          this.chartOptions.xData = res.data.nkNgEnumRespList.map((item) => {
            return item.context;
          });
          this.chartOptions.yData = res.data.nkNgEnumRespList.map((item) => {
            return item.num;
          });
          let result = res.data.nkNgEnumRespList.map((item) => {
            return item.ngRate.replace(/%/, "");
          });
          this.chartOptions.lineData = result;
          this.sortShow = true;
        }
      }).catch(() => {}).then(() => {
        this.listLoading = false;
      });
    },
    loadAll() {
      API.listPBatchNo({ deviceId: this.listQuery.deviceId }).then((res) => {
        if (res.code == 200) {
          this.restaurants = res.data || [];
        }
      });
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return state.patchNo.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    // 时间处理
    changeTime(e) {
      this.listQuery.startDate = e[0];
      this.listQuery.endDate = e[1];
    },
    // 数据导出
    outQuery() {
      API.exportProdInfoNg({
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
    padding-right: 100px;
    height: 44px;
    margin-bottom: 18px;
    .positonBtn {
      position: absolute;
      display: flex;
      align-items: center;
      bottom: 40px;
      top: 18px;
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
          padding-top: 5px;
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
