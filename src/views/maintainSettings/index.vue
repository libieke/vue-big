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
          </el-form-item>
        </el-form>
        <div class="positonBtn">
          <el-button type="primary" size="medium" @click="handleSet"
            >维护项设定</el-button
          >
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
            <template v-slot:actionColumn>
              <el-table-column label="操作" align="center" width="200">
                <template slot-scope="{ row }">
                  <span class="pointer blue mlr10" @click="handleReset(row)"
                    >重置</span
                  >
                </template>
              </el-table-column>
            </template>
          </custom-table>
        </div>
      </div>
      <!-- 重置维护时间 -->
      <el-dialog
        width="790px"
        title="重置维护时间"
        :visible.sync="visible"
        custom-class="custom-dialog"
        append-to-body
        :close-on-click-modal="false"
        top="15vh"
      >
        <div class="reset-box">
          <div class="text">输入密码确认</div>
          <el-form
            v-if="visible"
            ref="formDatas"
            v-loading="loading"
            :model="formDatas"
          >
            <el-form-item prop="passWord">
              <el-input
                v-model="formDatas.passWord"
                clearable
                placeholder="请输入密码"
                maxlength="320"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit2">确 认</el-button>
            <el-button @click="handleCancel2">取 消</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 维护项设定 -->
      <el-dialog
        title="维护项设定"
        :visible.sync="tableVisible"
        custom-class="custom-dialog"
        append-to-body
        :close-on-click-modal="false"
        top="10vh"
      >
        <div class="set-box">
          <el-button
            type="primary"
            style="margin-bottom: 24px"
            size="medium"
            @click="handAddSet"
            >新增维护项</el-button
          >
          <custom-table
            :fetch-loading="listLoading"
            :data="list"
            maxHeight="570px"
            :loading-text="loadingText"
            :table-column="tableColumn"
            :selection="false"
          >
            <template v-slot:actionColumn>
              <el-table-column label="操作" align="center" width="200">
                <template slot-scope="{ row }">
                  <span class="pointer mlr10" @click="handleEdit(row)"
                    >修改</span
                  >
                  <span class="pointer red mlr10" @click="handleDel(row)"
                    >删除</span
                  >
                </template>
              </el-table-column>
            </template>
          </custom-table>
        </div>
      </el-dialog>
      <!-- 新增维护项 -->
      <el-dialog
        width="790px"
        title="新增维护项"
        :visible.sync="visible2"
        custom-class="custom-dialog"
        append-to-body
        :close-on-click-modal="false"
        top="15vh"
      >
        <div class="reset-box">
          <el-form
            ref="dioFormData"
            v-loading="loading"
            :model="dioFormData"
            :rules="rules"
          >
            <el-form-item label="维护项名称" prop="goodsName">
              <el-input
                v-model="dioFormData.goodsName"
                clearable
                placeholder="请输入维护项名称"
                maxlength="320"
              />
            </el-form-item>
            <el-form-item label="更换回数" prop="setNumber">
              <el-select
                v-model="dioFormData.setNumber"
                placeholder="请选更换回数"
                style="width: 100%"
                clearable
              >
                <!-- <el-option
                  v-for="(item, i) in setNumber"
                  :key="i"
                  :label="item"
                  :value="item"
                ></el-option> -->
              </el-select>
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
      listQuery: {
        orderType: null,
        orderType1: null,
        orderType2: null,
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
      },
      visible: false,
      visible2: false,
      loading: false,
      tableVisible: false,
      formDatas: {
        passWord: null,
        setNumber: null,
      },
      dioFormData: {
        goodsName: null,
        setNumber: null,
      },
      rules: {
        goodsName: [
          { required: true, message: "请输出商品名称", trigger: "change" },
        ],
        goodsDosageType: [
          { required: true, message: "请选择剂型", trigger: "change" },
        ],
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
    // 重置按钮
    handleReset(row) {
      this.visible = true;
    },
    // 弹窗按钮
    handleCancel2() {
      // this.$refs.formDatas.resetFields();
      this.visible = false;
    },
    handleSubmit2() {
      this.$refs.formDatas.validate((valid) => {
        if (valid) {
        }
      });
    },
    handleSet() {
      this.tableVisible = true;
    },
    // 关闭新建&编辑弹框
    handleClose() {
      this.handleCancel2();
    },

    handleEdit(row) {},
    handleDel(row) {},

    handAddSet() {
      this.visible2 = true;
    },

    handleSave() {},
    handleCancel3() {},
    // 页面数据
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
          ranking: "5",
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
          ranking: "5",
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
          ranking: "5",
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
  margin-top: 24px;
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
</style>
