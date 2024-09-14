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
            <el-button type="primary" size="medium" @click="handleQuery"
              >查询</el-button
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
      <div class="content-box">
        <div class="left-box">
          <custom-table
            :fetch-loading="listLoading"
            :data="list"
            maxHeight="828px"
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
import * as API from "@/axios/common.js";
export default {
  components: {
    ContentTitle,
    CustomTable,
  },
  data() {
    return {
      value: "",
      loadingText: "加载中...",
      list: [],
      listLoading: false,
      // 自定义Pagination的参数
      hideOnSinglePage: false,
      listQuery: {
        pageNum: 1, // pageNum
        pageSize: 20, // pageSize
        deviceId: null,
        listDeviceType: null,
        listDeviceVersion: null,
        listDeviceAssetNumber: null,
        startTime: null,
        endTime: null,
        pbatchNo: null,
      },
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
        pbatchNo: {
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
          prop: "startTime",
          label: "开始时间",
        },
        {
          prop: "endTime",
          label: "结束时间",
        },
        {
          prop: "durationTime",
          label: "持续时间",
        },
        {
          prop: "deviceWarningCode",
          label: "报警代码",
        },
        {
          prop: "deviceWarningName",
          label: "详情说明",
        },
      ],
      // echarts数据
      chartOptions: {
        yData: [],
        xData: [],
      },
    };
  },
  mounted() {
    this.getList();
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
        let newRes = newVal.deviceId;
        let oldRes = oldVal.deviceId;
        if (newRes != oldRes) {
          this.listQuery.listDeviceVersion = "";
          this.listQuery.listDeviceAssetNumber = "";
        }
      },
      deep: true, // 深度侦听(对象里面层的值改变)
    },
  },
  methods: {
    handleQuery() {
      this.listQuery.pageNum = 1;
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
      this.listQuery.deviceId = item.listDeviceType;
      let version = item.listDeviceVersion;
      if (!version) {
        API.listDeviceVersion({ deviceTypeId: this.listQuery.deviceId }).then(
          (res) => {
            if (res.code == 200) {
              this.listQueryFormModel.listDeviceVersion.options = res.data;
            }
          }
        );
      } else if (version) {
        API.listDeviceAssetNumber({
          deviceTypeId: this.listQuery.deviceId,
          version: version,
        }).then((res) => {
          if (res.code == 200) {
            this.listQueryFormModel.listDeviceAssetNumber.options = res.data;
          }
        });
      }
    },

    getBatch() {
      API.listPBatchNo({ deviceId: this.listQuery.deviceId }).then((res) => {
        if (res.code == 200) {
          // console.log("res :>> ", res);
        }
      });
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
    handleSelect(item) {
      console.log(item);
    },
    getList() {
      API.getAlarmHis({
        ...this.listQuery,
      }).then((res) => {
        this.listLoading = true;
        if (res.code == 200) {
          this.list = res.data.list || res.data || [];
          this.listLoading = false;
        }
        this.listLoading = false;
      });
    },

    // 时间处理
    changeTime(e) {
      this.listQuery.startTime = e[0];
      this.listQuery.endTime = e[1];
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
  margin-top: 20px;
  .left-box {
    width: 100%;
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
</style>
