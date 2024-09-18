import axios from "axios";
import { Message } from "element-ui"; // MessageBox,
// response interceptor
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // request timeout
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 判断网络是否连接
    if (window.navigator.onLine) {
      return config;
    } else {
      Message("请检查网络！");
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);
// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (response.config.responseType === "blob") {
      return response;
    }
    if (res.code !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res;
  },
  (error) => {
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
