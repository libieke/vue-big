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
              value-key="pbatchNo"
              :fetch-suggestions="querySearchAsync"
              @input="loadAll"
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
          v-if="this.chartOptions.xData.length > 0"
          :chartOptions="chartOptions"
          height="350px"
          style="margin-bottom: 10px"
        ></BLchart>
        <el-empty
          v-else
          :image="require('@/assets/images/empty.png')"
        ></el-empty>
      </div>
      <div class="content-box">
        <div class="left-box">
          <custom-table
            :fetch-loading="listLoading"
            :data="list"
            :loading-text="loadingText"
            :table-column="tableColumn"
            :selection="false"
            :sort="this.list.length > 0 ? true : false"
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
      listLoading: false,
      listQuery: {
        deviceId: null,
        deviceTypeId: null,
        listDeviceType: null,
        listDeviceVersion: null,
        listDeviceAssetNumber: null,
        startTime: null,
        endTime: null,
        pbatchNo: null,
      },
      radio1: "日期",
      dataShow: true,
      batchShow: false,
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
        pbatchNo: {
          type: "input",
          label: "批次号",
          placeholder: "请输入批次号",
          show: false,
        },
      },
      restaurants: [],
      tableColumn: [
        {
          prop: "deviceWarningCode",
          label: "报警代码",
          width: "300",
        },
        {
          prop: "warningCount",
          label: "次数",
          width: "100",
        },
        {
          prop: "countPer",
          label: "次数比例",
          width: "200",
        },
        {
          prop: "durationTime",
          label: "持续时间",
          width: "300",
        },
        {
          prop: "deviceWarningName",
          label: "报警详情",
        },
      ],
      chartOptions: {
        yData: [],
        xData: [],
        lineData: [],
        title: "",
        subtext: "",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListDeviceType();
    });
  },
  computed: {
    listQueryFn() {
      return JSON.parse(JSON.stringify(this.listQuery));
    },
  },
  watch: {
    listQueryFn: {
      handler(newVal, oldVal) {
        let newRes = newVal.deviceTypeId;
        let oldRes = oldVal.deviceTypeId;
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
      this.getList();
    },
    getListDeviceType() {
      API.listDeviceType().then((res) => {
        if (res.code == 200) {
          this.listQueryFormModel.listDeviceType.options = res.data;
        }
      });
    },
    changeId(item) {
      this.listQuery.deviceTypeId = item.listDeviceType;
      let version = item.listDeviceVersion;
      if (!version) {
        API.listDeviceVersion({
          deviceTypeId: this.listQuery.deviceTypeId,
        }).then((res) => {
          if (res.code == 200) {
            this.listQueryFormModel.listDeviceVersion.options = res.data;
          }
        });
      } else if (version) {
        API.listDeviceAssetNumber({
          deviceTypeId: this.listQuery.deviceTypeId,
          version: version,
        }).then((res) => {
          if (res.code == 200) {
            this.listQueryFormModel.listDeviceAssetNumber.options = res.data;
            this.listQuery.deviceId = item.listDeviceAssetNumber;
          }
        });
      }
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
        return (
          state.pbatchNo.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    changeTab(e) {
      if (e === "日期") {
        this.batchShow = false;
        this.dataShow = true;
        this.listQueryFormModel.startDate.show = true;
        this.listQueryFormModel.pbatchNo.show = false;
        this.listQuery.pbatchNo = "";
      } else if (e === "批次") {
        this.dataShow = false;
        this.batchShow = true;
        this.listQueryFormModel.startDate.show = false;
        this.listQueryFormModel.pbatchNo.show = true;
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
    },
    getList() {
      API.getAlarmAly({
        ...this.listQuery,
      }).then((res) => {
        this.listLoading = true;
        if (res.code == 200) {
          this.list = res.data || res.data.list || [];
          this.chartOptions.title = "报警次数(个)";
          this.chartOptions.subtext = "报警次数(%)";
          this.chartOptions.xData = res.data.map((item) => {
            return item.deviceWarningName;
          });
          this.chartOptions.yData = res.data.map((item) => {
            return item.warningCount;
          });
          let result = res.data.map((item) => {
            return item.countPer.replace(/%/, "");
          });
          this.chartOptions.lineData = result;
          this.listLoading = false;
        }
        this.listLoading = false;
      });
    },
    changeTime(e) {
      this.listQuery.startTime = e[0];
      this.listQuery.endTime = e[1];
    },
    outQuery() {
      API.exportAlarmAly({
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
::v-deep .el-table {
  height: 828px !important;
}
::v-deep .el-empty__description p {
  font-size: 22px;
}
</style>
