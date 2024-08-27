import Vue from "vue";
import Router from "vue-router";
import home from "@/views/home";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/operationAtatus",
    },
    {
      path: "",
      name: "home",
      component: home,
      children: [
        {
          path: "/operationAtatus",
          name: "operationAtatus",
          component: () => import("@/views/operationAtatus"),
        },
        {
          path: "/productionInformation",
          name: "productionInformation",
          component: () => import("@/views/productionInformation"),
        },
        {
          path: "/productAnalysis",
          name: "productAnalysis",
          component: () => import("@/views/productAnalysis"),
        },
        {
          path: "/alarmHistory",
          name: "alarmHistory",
          component: () => import("@/views/alarmHistory"),
        },
        {
          path: "/alarmAnalysis",
          name: "alarmAnalysis",
          component: () => import("@/views/alarmAnalysis"),
        },
        {
          path: "/maintainSettings",
          name: "maintainSettings",
          component: () => import("@/views/maintainSettings"),
        },
      ],
    },
  ],
});
export default router;
