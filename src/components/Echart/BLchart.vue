<template>
  <div
    ref="barChart"
    id="barChart"
    :style="{ height: height, width: width }"
  ></div>
</template>

<script>
import echarts from "@/lib/echarts";

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
    this.resizeHandler = () => {
      if (this.chart) {
        this.chart.resize();
      }
    };
    window.addEventListener("resize", this.resizeHandler);
  },
  beforeDestroy() {
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
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
      const chartDom = this.$refs.barChart;
      if (!chartDom) {
        return;
      }
      if (!this.chart) {
        this.chart = echarts.init(chartDom);
      }

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
          textStyle: {
            fontSize: 20,
            color: "#000",
          },
        },
        grid: {
          left: 15,
          top: "17%",
          bottom: 20,
          right: 15,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#657387",
              width: 2,
            },
          },
          axisLabel: {
            color: "#6d7b8e",
            fontSize: 20,
            // interval: 0,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: this.chartOptions.xData,
        },
        yAxis: [
          {
            type: "value",
            show: true,
            axisLine: {
              show: false, //是否显示
              lineStyle: {
                color: "#fff",
              },
            },
            alignTicks: true,
            position: "left",
            axisLabel: {
              color: "#6d7b8e",
              fontSize: 20,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                width: 1,
                color: "#fff",
              },
            },
          },
          {
            type: "value",
            show: true,
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
              color: "#6d7b8e",
              fontSize: 20,
            },
          },
        ],
        series: [
          {
            type: "bar",
            name: "报警次数(个)",
            tooltip: {
              show: true,
              color: "#000",
            },
            animation: false,
            barWidth: 40,
            itemStyle: {
              color: "#207CDB",
            },
            data: this.chartOptions.yData,
          },
          {
            type: "line",
            name: "报警占比(%)",
            yAxisIndex: 1,
            smooth: true,
            symbol: "circle",
            symbolSize: 10,
            data: this.chartOptions.lineData,
            itemStyle: {
              color: "#EB5042",
              lineStyle: {
                color: "#EB5042",
                width: 3,
                opacity: 1,
              },
            },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(option);
    },
  },
};
</script>
