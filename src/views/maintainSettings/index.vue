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
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleQuery">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="positonBtn">
          <el-button type="primary" size="medium" @click="handleAdd"
            >新增维护项</el-button
          >
        </div>
      </div>
      <div class="content-box">
        <div class="left-box">
          <custom-table
            ref="tableScroll"
            @resetFn="handleReset"
            :fetch-loading="listLoading"
            :data="list"
            maxHeight="828px"
            :loading-text="loadingText"
            :table-column="tableColumn"
            :selection="false"
          >
            <template v-if="list.length > 0 && list" v-slot:actionColumn>
              <el-table-column label="操作" align="center" width="200">
                <template slot-scope="{ row }">
                  <span class="pointer cyan mlr10" @click="handleEdit(row)">编辑</span>
                  <span class="pointer red mlr10" @click="handleDel(row)">删除</span>
                </template>
              </el-table-column>
            </template>
          </custom-table>
        </div>
      </div>
      <!-- 重置维护时间 -->
      <el-dialog
        width="790px"
        :title="title2"
        :visible.sync="visible"
        custom-class="custom-dialog"
        append-to-body
        :close-on-click-modal="false"
        :before-close="handleClose"
        top="15vh"
      >
        <div class="reset-box">
          <div class="text">输入密码确认</div>
          <el-form ref="formDatas" v-loading="loading" :model="formDatas">
            <el-form-item prop="password">
              <el-input
                v-model="formDatas.password"
                clearable
                placeholder="请输入密码"
                maxlength="320"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit2()">确 认</el-button>
            <el-button @click="handleCancel2">取 消</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 新增/修改维护项 -->
      <el-dialog
        width="790px"
        :title="dioTitle"
        :visible.sync="visible2"
        custom-class="custom-dialog"
        append-to-body
        :close-on-click-modal="false"
        :before-close="handleClose"
        top="15vh"
      >
        <div class="reset-box">
          <el-form
            ref="dioFormData"
            v-loading="loading"
            :model="dioFormData"
            :rules="rules"
            label-width="100px"
            label-position="left"
          >
            <el-form-item label="维护项名称" prop="partName">
              <el-input
                v-model="dioFormData.partName"
                clearable
                placeholder="请输入维护项名称"
                maxlength="320"
              />
            </el-form-item>
            <el-form-item label="更换回数" prop="timeNum">
              <el-input
                v-model.number="dioFormData.timeNum"
                clearable
                placeholder="请输入更换回数"
                maxlength="320"
              />
            </el-form-item>
            <el-form-item label="开始时间" prop="servicingTime">
              <el-date-picker
                v-model="dioFormData.servicingTime"
                placeholder="选择开始时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                :picker-options="{
                  disabledDate: (time) => {
                    return time.getTime() > Date.now();
                  },
                }"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSave">保 存</el-button>
            <el-button @click="handleCancel3">取 消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </ContentTitle>
</template>

<script>
import ContentTitle from "@/components/ContentTitle/index";
import CustomTable from "@/components/CustomTable";
import * as API from "@/axios/common.js";
import { REGEX_age } from "@/utils/checkUtils.js";
export default {
  components: {
    ContentTitle,
    CustomTable,
  },
  data() {
    return {
      loadingText: "加载中...",
      list: [],
      listLoading: false,
      listQuery: {
        pageNum: 1, // pageNum
        pageSize: 20, // pageSize
        deviceId: null,
        deviceTypeId: null,
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
      },
      // 根据接口和设计稿设置表头
      tableColumn: [
        {
          prop: "partName",
          label: "名称",
          width: "530px",
        },
        {
          prop: "servicingTime",
          label: "维护时间",
          width: "339px",
          isBotton: true,
        },
        {
          prop: "timeNum",
          label: "更换回数",
          width: "232px",
        },
        {
          prop: "replacementSchedule",
          label: "更换进程",
        },
      ],
      // echarts数据
      chartOptions: {
        yData: [],
        xData: [],
        title: "",
      },
      // 弹窗
      dioTitle: "新增维护项",
      title2: "",
      visible: false,
      visible2: false,
      loading: false,
      formDatas: {
        password: null,
      },
      dioFormData: {
        partName: "",
        timeNum: null,
        deviceId: null,
        servicingTime: "",
      },
      id: null,
      delId: null,
      pwdId: null,
      rules: {
        partName: [{ required: true, message: "请输入维护项名称", trigger: ["blur"] }],
        servicingTime: [{ required: true, message: "请选择日期", trigger: ["blur"] }],
        timeNum: [
          { required: true, message: "请输入更换回数", trigger: ["blur"] },
          { pattern: REGEX_age, message: "请输入正整数" },
        ],
      },
    };
  },
  mounted() {
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
    loadInitialData() {
      return this.getListDeviceType()
        .then(() => {
          const firstType = this.listQueryFormModel.listDeviceType.options[0];
          if (!firstType) {
            return null;
          }
          this.listQuery.listDeviceType = firstType.id;
          this.listQuery.deviceTypeId = firstType.id;
          return this.changeId(this.listQuery);
        })
        .then(() => this.handleQuery())
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
      this.listQuery.deviceTypeId = item.listDeviceType;
      let version = item.listDeviceVersion;
      const versionRequest = API.listDeviceVersion({
        deviceTypeId: this.listQuery.deviceTypeId,
      }).then((res) => {
        if (res.code == 200) {
          this.listQueryFormModel.listDeviceVersion.options = res.data;
        }
      });
      const assetRequest = API.listDeviceAssetNumber({
        deviceTypeId: this.listQuery.deviceTypeId,
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
            this.dioFormData.deviceId = deviceId;
          }
        }
      });
      return Promise.all([versionRequest, assetRequest]);
    },

    handleReset(row) {
      this.visible = true;
      this.title2 = "重置维护时间";
      this.pwdId = row.id;
    },
    // 弹窗按钮-重置密码
    handleCancel2() {
      if (this.$refs.formDatas != undefined) {
        this.$refs.formDatas.resetFields();
        this.formDatas.password = "";
        this.visible = false;
      }
    },
    // 输入密码确认后提交
    handleSubmit2() {
      this.$refs.formDatas.validate((valid) => {
        if (valid) {
          API.verifyPwd({
            ...this.formDatas,
          }).then((res) => {
            if (res.code == 200) {
              if (this.title2 == "重置维护时间") {
                this.$confirm("是否要重置时间?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }).then(() => {
                  API.resetServicingTime({
                    id: this.pwdId,
                  }).then((res) => {
                    if (res.code == 200) {
                      this.$message.success("重置成功!");
                      this.getList();
                      this.visible = false;
                    } else {
                      this.$message.error("重置失败!");
                      this.getList();
                      this.visible = false;
                    }
                  });
                });
              } else if (
                this.title2 == "新增维护信息验证" &&
                this.dioTitle === "新增维护项"
              ) {
                this.visible2 = true;
                this.$refs.dioFormData.clearValidate();
                this.handleSave();
              } else if (this.title2 == "修改维护信息验证") {
                this.visible2 = true;
              } else if (this.title2 == "删除维护信息验证") {
                this.$confirm("是否要删除该数据?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                  .then(() => {
                    API.removeProdLife({
                      id: this.delId,
                    }).then((res) => {
                      if (res.code == 200) {
                        this.$message.success("删除成功!");
                        this.visible = false;
                        this.getList();
                      } else {
                        this.$message.error("删除失败!");
                        this.visible = false;
                        this.getList();
                      }
                    });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消",
                    });
                  });
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleAdd() {
      this.formDatas.password = "";
      this.visible = true;
      this.title2 = "新增维护信息验证";
    },
    handleClose() {
      this.handleCancel2();
      this.handleCancel3();
    },
    handleEdit(row) {
      this.formDatas.password = "";
      this.visible = true;
      this.title2 = "修改维护信息验证";
      this.dioTitle = "修改维护项";
      this.dioFormData.partName = row.partName;
      this.dioFormData.timeNum = row.timeNum;
      this.dioFormData.servicingTime = row.servicingTime;
      this.id = row.id;
    },
    handleDel(row) {
      this.visible = true;
      this.title2 = "删除维护信息验证";
      this.delId = row.id;
    },
    handAddSet() {
      this.visible2 = true;
      this.dioTitle = "新增维护项";
    },
    handleSave() {
      this.$refs.formDatas.validate((valid) => {
        if (valid) {
          API.verifyPwd({
            ...this.formDatas,
          }).then((res) => {
            if (res.code == 200) {
              this.visible2 = true;
              this.$refs.dioFormData.validate((valid) => {
                if (valid) {
                  const that = this;
                  if (that.dioTitle === "新增维护项") {
                    API.addProdLifeNum({
                      ...this.dioFormData,
                    }).then((res) => {
                      if (res.code == 200) {
                        that.getList();
                        that.$message.success("新建成功！");
                        that.handleClose();
                        that.visible2 = false;
                      }
                    });
                  }
                  if (that.dioTitle === "修改维护项") {
                    API.updateProdTimeNum({
                      ...this.dioFormData,
                      id: this.id,
                    }).then((res) => {
                      if (res.code == 200) {
                        this.$confirm("是否确认该操作?", "提示", {
                          confirmButtonText: "确定",
                          cancelButtonText: "取消",
                          type: "warning",
                        }).then(() => {
                          that.$message.success("编辑成功！");
                          that.getList();
                          that.handleClose();
                          that.visible2 = false;
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          console.log("error message!!");
          return false;
        }
      });
    },

    handleCancel3() {
      if (this.$refs.dioFormData != undefined) {
        this.$refs.dioFormData.resetFields();
        this.dioFormData.partName = "";
        this.dioFormData.timeNum = "";
        this.dioFormData.servicingTime = "";
        this.visible2 = false;
      }
    },
    getList() {
      this.listLoading = true;
      return API.getProdLifeNum({
        deviceId: this.listQuery.deviceId,
      }).then((res) => {
        if (res.code == 200) {
          this.list = res.data || res.data.list || [];
        }
      }).catch(() => {}).then(() => {
        this.listLoading = false;
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
      right: 0;
      top: 15px;
      display: flex;
      align-items: center;
      bottom: 20px;
      .tab-text {
        font-size: 20px;
        color: #ffffff;
        padding-right: 8px;
      }
    }
  }
}
::v-deep .custom-dialog {
  background: #061a40;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #00539f;
}
.reset-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .text {
    font-weight: 500;
    font-size: 36px;
    color: #ffffff;
    margin-bottom: 32px;
  }
  .dialog-footer {
    display: flex;
    align-content: center;
    margin-top: 50px;
    justify-content: center;
  }
}
.content-box {
  display: flex;
  // margin-top: 24px;
  .left-box {
    padding: 24px;
    text-align: center;
    background: rgba(32, 124, 219, 0.1);
    border-radius: 16px 16px 16px 16px;
    border: 2px solid #003b7a;
    overflow: hidden;
  }
}
.set-box {
  padding: 0 10px;
}
::v-deep .el-table {
  height: 828px !important;
}
</style>
