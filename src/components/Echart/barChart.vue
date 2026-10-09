<template>
  <div ref="barChart" id="barChart" :style="{ height: height, width: width }"></div>
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
          top: "15%",
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
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: this.chartOptions.xData,
        },
        color: ["#207CDB", "#b5c7ff"],
        yAxis: {
          // type: "value",
          show: true,
          axisLine: {
            show: false, //是否显示
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
        series: [
          {
            type: "bar",
            name: "生产计数(个)",
            tooltip: {
              show: true,
              color: "#000",
            },
            animation: false,
            barWidth: 40,
            data: this.chartOptions.yData,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(option);
    },
  },
};
</script>
