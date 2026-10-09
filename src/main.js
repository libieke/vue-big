import Vue from "vue";
import "normalize.css/normalize.css";
import App from "./App";
import router from "./router";
import iView from "iview";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss";
import "@/icons"; // icon

// 屏幕适配
import VScaleScreen from "v-scale-screen";

// Mock 工具 - 仅在开发环境暴露
if (process.env.NODE_ENV === 'development') {
  try {
    const { exposeMockToolsToConsole } = require('@/mock/tools');
    exposeMockToolsToConsole();
  } catch (error) {
    console.warn('Mock 工具加载失败');
  }
}

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(VScaleScreen);
Vue.use(ElementUI);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
