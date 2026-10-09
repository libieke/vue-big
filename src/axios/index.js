import axios from "axios";
import { Message } from "element-ui"; // MessageBox,
// response interceptor
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // request timeout
});

// 如果启用了 mock 模式，则使用 mock 服务
// 可通过 process.env.VUE_APP_MOCK 或 localStorage 的 'useMock' 控制
const useMock = process.env.VUE_APP_MOCK === 'true' || (typeof localStorage !== 'undefined' && localStorage.getItem('useMock') === 'true');
if (useMock) {
  try {
    const mockService = require('@/mock/index').default;
    mockService.install(service);
    console.log('✓ Mock 数据已启用');
  } catch (error) {
    console.warn('Mock 服务加载失败:', error);
  }
}

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
    // 安全检查 config 是否存在
    if (response.config && response.config.responseType === "blob") {
      return response;
    }
    if (!res || typeof res !== 'object') {
      Message({
        message: "响应数据格式错误",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error("响应数据格式错误"));
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
