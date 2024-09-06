<template>
  <div class="win-box">
    <div class="top-box">
      <div class="left">
        <div class="left-text">设备状态</div>
        <div class="state">
          <span class="marginR-5">运行</span>
          <span class="point green"> </span>
        </div>
        <div class="state">
          <span class="marginR-5">停机</span>
          <span class="point yellow"> </span>
        </div>
        <div class="state">
          <span class="marginR-5">故障</span>
          <span class="point red"> </span>
        </div>
      </div>
      <div class="right" @click="showMore">
        <span class="svg-container font-28">
          <svg-icon icon-class="square" />
        </span>
      </div>
    </div>
    <div class="content-box" id="cardW">
      <div
        class="item-box"
        v-for="(item, index) in dataList"
        :key="index"
        @click="toDetials(item)"
        :v-loading="listLoading"
      >
        <div class="top-box">
          <div class="left text-green">
            <div class="left-text1">卷取</div>
            <div class="left-text1">S9528</div>
            <div>
              <img src="@/assets/images/respect.png" />
            </div>
          </div>
          <div class="pointBig green"></div>
        </div>
        <div class="item-content">
          <div class="item">
            <div class="content-title">生产信息</div>
            <div class="item-info">
              <div class="item-goods">
                <div class="item-num">{{ item.num }}</div>
                <div class="item-text">{{ item.text }}</div>
              </div>
              <div class="line">
                <el-divider direction="vertical"></el-divider>
              </div>
              <div class="item-goods">
                <div class="item-num">9000</div>
                <div class="item-text">良品数</div>
              </div>
              <div class="line">
                <el-divider direction="vertical"></el-divider>
              </div>
              <div class="item-goods">
                <div class="item-num">9000</div>
                <div class="item-text">良品数</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div style="margin-top: 30px" class="content-title">稼动数据</div>
            <div class="item-info">
              <div class="item-goods">
                <div class="item-num">9000</div>
                <div class="item-text">良品数</div>
              </div>
              <div class="line">
                <el-divider direction="vertical"></el-divider>
              </div>
              <div class="item-goods">
                <div class="item-num">9000</div>
                <div class="item-text">良品数</div>
              </div>
              <div class="line">
                <el-divider direction="vertical"></el-divider>
              </div>
              <div class="item-goods">
                <div class="item-num">9000</div>
                <div class="item-text">良品数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showMoreCard" class="pagination">
      <SmallPagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        :hide-on-single-page="hideOnSinglePage"
        :background="true"
        :small="true"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import SmallPagination from "@/components/SmallPagination";
import * as API from "@/axios/common.js";

export default {
  name: "operationAtatus",
  data() {
    return {
      showMoreCard: true,
      total: 0,
      listLoading: false,
      hideOnSinglePage: false,
      listQuery: {
        pageNo: 1, // pageNum
        pageSize: 8, // pageSize
        prodLine: "tr",
      },
      dataList: [],
    };
  },
  components: { SmallPagination },
  mounted() {
    this.getList();
  },
  methods: {
    // 全展示
    showMore() {
      if (this.showMoreCard) {
        this.showMoreCard = false;
        document.getElementById("cardW").style.zoom = 0.5;
        console.log("object :>> ", document.getElementById("cardW").style);
        this.dataList = [
          {
            num: "9000",
            text: "良品数",
          },
          {
            num: "9000",
            text: "良品数",
          },
        ];
      } else {
        this.showMoreCard = true;
        document.getElementById("cardW").style.zoom = 1;
        this.getList();
      }
    },
    // 页面详情
    toDetials(item) {
      console.log("object :>> ", item);
      // if (row.shopGoodStatus === 1 && status !== "detail") {
      //   this.$message.warning("已上架商品无法编辑");
      //   return false;
      // }
      this.$router.push({
        path: "/productionInformation",
        // query: {
        //   id: row.goodsId ? row.goodsId : "",
        //   status: status ? status : "",
        // },
      });
    },
    // 页面数据
    getList() {
      // 获取表格详情
      API.getHome({
        ...this.listQuery,
      }).then((res) => {
        this.listLoading = true;
        if (res.code == "200") {
          // this.dataList = res.data || [];
          // this.listLoading = false;
        }
        this.listLoading = false;
      });

      console.log("页面数据");
      this.dataList = [
        {
          num: "9000",
          text: "良品数",
        },
        {
          num: "9000",
          text: "良品数",
        },
        {
          num: "9000",
          text: "良品数",
        },
        {
          num: "9000",
          text: "良品数",
        },
        {
          num: "9000",
          text: "良品数",
        },
        {
          num: "9000",
          text: "良品数",
        },
        {
          num: "9000",
          text: "良品数",
        },
        {
          num: "9000",
          text: "良品数",
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.win-box {
  padding: 5px 26px 0;
}
// 公共样式
.text-green {
  color: #14cc8f;
}
.text-red {
  color: #eb5042;
}
.text-yellow {
  color: #ffc232;
}

.marginR-5 {
  margin-right: 8px;
}
.point {
  width: 16px;
  height: 16px;
  border-radius: 12px 12px 12px 12px;
}
.pointBig {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
// 圆点样式
.green {
  background: linear-gradient(0, rgba(255, 255, 255, 0) 65%, #ffffff 91%),
    #14cc8f;
  border-radius: 20px 20px 20px 20px;
  border: 1px solid #14cc8f;
}
.yellow {
  background: linear-gradient(0, rgba(255, 255, 255, 0) 65%, #ffffff 91%),
    #ffc232;
  border: 1px solid #ffc232;
}
.red {
  background: linear-gradient(0, rgba(255, 255, 255, 0) 65%, #ffffff 91%),
    #eb5042;
  border: 1px solid #eb5042;
}
.top-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px 0;
  color: #fff;

  .left {
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .left-text {
      font-size: 32px;
      margin-right: 40px;
      font-weight: 500;
    }
    .state {
      display: flex;
      align-items: center;
      border-radius: 4px;
      border: 1px solid #003b7a;
      margin: 0 16px;
      padding: 6px 9px;
      font-weight: 500;
      font-size: 22px;
    }
  }
  .right {
    cursor: pointer;
    color: #fff;
    &:hover {
      color: #00d8f4;
    }
  }
}
.content-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px 0;

  .item-box {
    width: 442px;
    height: 400px;
    padding: 12px;
    margin: 12px;
    background: linear-gradient(
        180deg,
        rgba(8, 92, 203, 0.7) 0%,
        rgba(2, 28, 69, 0.1) 21%
      ),
      rgba(32, 124, 219, 0.1);
    border-radius: 16px 16px 16px 16px;
    border: 2px solid #003b7a;

    .top-box {
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      .left {
        justify-content: space-between;
        margin-right: 0;
        font-weight: 500;
        .left-text1 {
          font-size: 32px;
          padding-right: 14px;
        }
      }
    }
  }

  .item-content {
    padding: 20px;

    .content-title {
      font-size: 24px;
      color: #7fb5ed;
    }
    .item-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item-goods {
        .item-num {
          color: #dbfaff;
          font-size: 36px;
          padding-bottom: 10px;
        }
        .item-text {
          font-size: 22px;
          color: #ffffff;
        }
      }
      .line {
        opacity: 0.1;
        .el-divider--vertical {
          margin-top: 10px;
          height: 56px;
        }
      }
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  background: transparent;
}
// ::v-deep .el-pagination {
//   margin: -15px auto;
// }
// prev和next箭头的样式
::v-deep .el-pagination .btn-next,
::v-deep .el-pagination .btn-prev {
  background: #003c7c !important;
  background-color: transparent !important;
}
// prev和next箭头disabled的样式
::v-deep .el-pagination button:disabled {
  background-color: transparent !important;
}
// active的页码样式
::v-deep .el-pager li.active {
  color: #003c7c !important;
}
</style>
