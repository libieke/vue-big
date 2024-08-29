<template>
  <div class="win-box unselectable-text">
    <div class="top-box">
      <div class="left">
        <div class="left-text">设备状态</div>
        <div class="state">
          <span class="marginR-5">运行</span>
          <span class="svg-container font-10">
            <svg-icon icon-class="greenDots" />
          </span>
        </div>
        <div class="state">
          <span class="marginR-5">停机</span>
          <span class="svg-container font-10">
            <svg-icon icon-class="redDots" />
          </span>
        </div>
        <div class="state">
          <span class="marginR-5">故障</span>
          <span class="svg-container font-10">
            <svg-icon icon-class="yellowDots" />
          </span>
        </div>
      </div>
      <div class="right" @click="showMore">
        <span class="svg-container font-20">
          <svg-icon icon-class="square" />
        </span>
      </div>
    </div>
    <div class="content-box" id="cardW">
      <div
        :class="['item-box', showMoreCard == true ? 'width30' : 'width10']"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <div class="top-box">
          <div class="left">
            <div class="left-text">卷取</div>
            <div class="left-text">S9528</div>
            <div class="right">
              <span class="svg-container font-20">
                <svg-icon icon-class="work" />
              </span>
            </div>
          </div>
          <div>
            <span class="svg-container font-20">
              <svg-icon icon-class="bigGreenDots" />
            </span>
          </div>
        </div>
        <div class="item-content">
          <div class="item">
            <div class="content-title">生产信息</div>
            <div class="item-info">
              <div class="item-goods">
                <div class="item-num">{{ item.num }}</div>
                <div class="item-text">{{ item.text }}</div>
              </div>
              <div class="item-goods">
                <div class="item-num">9000</div>
                <div class="item-text">良品数</div>
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
              <div class="item-goods">
                <div class="item-num">9000</div>
                <div class="item-text">良品数</div>
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
        :page.sync="listQuery.pageNum"
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
export default {
  name: "operationAtatus",
  data() {
    return {
      showMoreCard: true,
      total: 20,
      hideOnSinglePage: false,
      listQuery: {
        pageNum: 1, // pageNum
        pageSize: 8, // pageSize
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
    // 页面数据
    getList() {
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
  padding: 13px 24px 0;
}
.marginR-5 {
  margin-right: 5px;
}

.top-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 20px 0;
  color: #fff;

  .left {
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .left-text {
      font-size: 24px;
      margin-right: 20px;
    }
    .state {
      display: flex;
      align-items: center;
      border-radius: 4px;
      border: 1px solid #003b7a;
      margin: 0 16px;
      padding: 4px;
      font-size: 22px;
    }
  }
  .right {
    cursor: pointer;
    color: #fff;
    &:hover {
      color: red;
    }
  }
}
.content-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 20px 0;

  .item-box {
    width: 400px;
    height: 340px;
    padding: 12px;
    margin: 10px;
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
      border-bottom: 1px solid #fff;
    }
  }

  .width30 {
    width: 23%;
  }
  .width10 {
    width: 10%;
  }
  .item-content {
    padding: 20px;

    .content-title {
      font-size: 20px;
      color: #7bb0e7;
    }
    .item-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item-goods {
        &:nth-child(2) {
          padding: 0 44px;
          border-right: 1px solid #fff;
          border-left: 1px solid #fff;
        }
        .item-num {
          color: #fff;
          font-size: 24px;
          padding-bottom: 10px;
        }
        .item-text {
          font-size: 14px;
          color: #6b7a8d;
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
::v-deep .el-pagination {
  margin: -20px auto;
}
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
