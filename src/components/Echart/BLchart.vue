<template>
  <div ref="barChart" :style="{ height: height, width: width }"></div>
</template>

<script>
import * as echarts from "echarts";
import { color } from "echarts/lib/export";

export default {
  props: {
    chartOptions: {
      type: Object,
      default: () => {},
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
  },
  mounted() {
    this.initEcharts();
  },
  watch: {
    chartOptions: {
      handler(newVal, oldVal) {
        this.initEcharts();
      },
      // 这里的deep是深度监听，因为我们传递过来的是一个对象
      deep: true,
    },
  },
  methods: {
    initEcharts() {
      var myChart = echarts.init(this.$refs.barChart);
      // 指定图表的配置项和数据
      var option = {
        // backgroundColor: "rgba(32, 124, 219, 0.1)",
        title: [
          {
            text: this.chartOptions.title,
            x: 0,
            top: 0,
            textStyle: {
              fontWeight: "500",
              fontSize: 24,
              color: "#FFFFFF",
            },
          },
          {
            subtext: this.chartOptions.subtext,
            left: "right",
            top: -10,
            subtextStyle: {
              color: "rgba(255,255,255,0.9)",
              fontSize: "22px",
            },
          },
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: 15,
          top: "15%",
          bottom: 20,
          right: 15,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          // boundaryGap: [0, 0.01],
          // boundaryGap: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#657387",
              width: 2,
            },
          },
          axisLabel: {
            textStyle: {
              color: "#6d7b8e",
              fontSize: 20,
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: this.chartOptions.xData,
        },
        // color: ["#207CDB", "#EB5042"],
        yAxis: [
          {
            type: "value",
            min: 0,
            show: true,
            axisLine: {
              show: true, //是否显示
              lineStyle: {
                color: "#fff",
              },
            },
            alignTicks: true,
            position: "left",
            axisLabel: {
              textStyle: {
                color: "#6d7b8e",
                fontSize: 20,
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                width: 1,
                color: "#fff",
              },
            },
            // data: this.chartOptions.yData,
          },
          {
            type: "value",
            name: "个数",
            min: 0,
            position: "right",
            axisLine: {
              show: false, //是否显示
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                width: 1,
                color: "#fff",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#6d7b8e",
                fontSize: 20,
              },
            },
          },
        ],
        series: [
          {
            type: "bar",
            name: "bar",
            tooltip: {
              show: true,
            },
            animation: false,
            barWidth: 40,
            itemStyle: {
              color: "#207CDB",
            },
            hoverAnimation: false,

            data: this.chartOptions.yData,
          },
          {
            type: "line",
            yAxisIndex: 1,
            name: "报警次数",
            smooth: true,
            symbol: "circle",
            hoverAnimation: false,
            symbolSize: 10,
            data: this.chartOptions.lineData,
            itemStyle: {
              normal: {
                color: "#EB5042",
                lineStyle: {
                  color: "#EB5042",
                  width: 3,
                  opacity: 1,
                },
              },
            },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>
