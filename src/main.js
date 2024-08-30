import Vue from "vue";
import "normalize.css/normalize.css";
import App from "./App";
import router from "./router";
import iView from "iview";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss";
import "@/icons"; // icon

// import * as echarts from "echarts";

import VScaleScreen from "v-scale-screen";

// Vue.prototype.$echarts = function (el) {
//   return echarts.init(el, null, { renderer: "svg" });
// };
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(VScaleScreen);
Vue.use(ElementUI);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
