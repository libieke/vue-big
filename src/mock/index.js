/**
 * Mock 服务 - 简化版本，无依赖
 * 用于拦截所有 axios 请求并返回 mock 数据
 */

import * as mockData from './data';

class MockService {
  constructor() {
    this.routes = new Map();
    this.registerRoutes();
  }

  /**
   * 注册所有的 mock 路由
   */
  registerRoutes() {
    // 工程类型
    this.register('/wire/nk/tr/listDeviceType', 'POST', () => ({
      code: 200,
      message: '成功',
      data: mockData.mockDeviceTypes
    }));

    // 机型列表
    this.register('/wire/nk/tr/listDeviceVersion', 'POST', () => ({
      code: 200,
      message: '成功',
      data: mockData.mockDeviceVersions
    }));

    // 设备资产编号
    this.register('/wire/nk/tr/listDeviceAssetNumber', 'POST', () => ({
      code: 200,
      message: '成功',
      data: mockData.mockDeviceAssetNumbers
    }));

    // 批次号
    this.register('/wire/nk/tr/listPBatchNo', 'POST', () => ({
      code: 200,
      message: '成功',
      data: mockData.mockBatchNumbers
    }));

    // 首页运行状况
    this.register('/wire/nk/getHome', 'POST', (config) => {
      const { pageNo = 1, pageSize = 8 } = this.parseData(config.data);
      const allData = mockData.mockHomeData.data.list;
      const startIndex = (pageNo - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const list = allData.slice(startIndex, endIndex);
      
      return {
        code: 200,
        message: '成功',
        data: {
          list: list,
          pageNo: pageNo,
          pageSize: pageSize,
          pageMax: Math.ceil(allData.length / pageSize),
          total: allData.length,
          totalDevices: mockData.mockHomeData.data.totalDevices,
          runningDevices: mockData.mockHomeData.data.runningDevices,
          idleDevices: mockData.mockHomeData.data.idleDevices,
          faultDevices: mockData.mockHomeData.data.faultDevices
        }
      };
    });

    // 生产信息
    this.register('/wire/nk/getProdInfo', 'POST', (config) => {
      const { pageNo = 1, pageSize = 10 } = this.parseData(config.data);
      return mockData.generateProdInfoList(pageNo, pageSize);
    });

    // 不良品分析
    this.register('/wire/nk/getProdInfoNg', 'POST', (config) => {
      const { pageNo = 1, pageSize = 10 } = this.parseData(config.data);
      return mockData.generateProdInfoNgList(pageNo, pageSize);
    });

    // 报警历史
    this.register('/wire/nk/tr/getAlarmHis', 'POST', (config) => {
      const { pageNo = 1, pageSize = 10 } = this.parseData(config.data);
      return mockData.generateAlarmHistoryList(pageNo, pageSize);
    });

    // 报警分析
    this.register('/wire/nk/tr/getAlarmAly', 'POST', (config) => {
      const { pageNo = 1, pageSize = 10 } = this.parseData(config.data);
      return mockData.generateAlarmAnalysisList(pageNo, pageSize);
    });

    // 维护设置
    this.register('/wire/nk/tr/getProdLifeNum', 'POST', () => mockData.mockMaintainSettings);

    // 控制图数据
    this.register('/wire/nk/getAgeing', 'POST', () => mockData.mockAgeingData);

    // 密码校验
    this.register('/wire/nk/tr/verifyPwd', 'POST', (config) => {
      const { password } = this.parseData(config.data);
      return {
        code: password === '123456' ? 200 : 401,
        message: password === '123456' ? '密码正确' : '密码错误',
        data: { valid: password === '123456' }
      };
    });

    // 重置维护时间
    this.register('/wire/nk/tr/resetServicingTime', 'POST', (config) => {
      const data = this.parseData(config.data);
      return {
        code: 200,
        message: '维护时间重置成功',
        data: {
          deviceId: data.deviceId,
          lastMaintenanceTime: new Date().toLocaleString('zh-CN'),
          nextMaintenanceTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN')
        }
      };
    });

    // 新增维护设置
    this.register('/wire/nk/tr/addProdLifeNum', 'POST', (config) => {
      const data = this.parseData(config.data);
      return {
        code: 200,
        message: '维护设置新增成功',
        data: {
          id: 'NEW_' + Date.now(),
          ...data,
          status: '正常'
        }
      };
    });

    // 更新维护设置
    this.register('/wire/nk/tr/updateProdTimeNum', 'POST', (config) => {
      const data = this.parseData(config.data);
      return {
        code: 200,
        message: '维护设置更新成功',
        data
      };
    });

    // 删除维护设置
    this.register('/wire/nk/tr/removeProdLife', 'POST', (config) => {
      const { id } = this.parseData(config.data);
      return {
        code: 200,
        message: '维护设置删除成功',
        data: { deletedId: id }
      };
    });
  }

  /**
   * 注册一个路由
   */
  register(url, method, handler) {
    const key = `${method} ${url}`;
    this.routes.set(key, handler);
  }

  /**
   * 匹配路由并执行处理函数
   */
  match(url, method, config) {
    const key = `${method.toUpperCase()} ${url}`;
    if (this.routes.has(key)) {
      const handler = this.routes.get(key);
      return handler(config);
    }
    return null;
  }

  /**
   * 解析数据
   */
  parseData(data) {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data || {};
    } catch {
      return {};
    }
  }

  /**
   * 集成到 axios 实例
   */
  install(axiosInstance) {
    // 添加请求拦截器 - 主动拦截 Mock 路由，避免实际请求
    axiosInstance.interceptors.request.use(
      config => {
        // 检查是否是 Mock 路由
        const mockResponse = this.match(config.url, config.method, config);
        if (mockResponse !== null) {
          // 使用自定义 adapter 直接返回 Mock 响应，避免请求被代理到真实后端
          const requestConfig = config;
          config.__isMockRequest = true;
          config.__mockData = mockResponse;
          config.adapter = () => Promise.resolve({
            data: mockResponse,
            config: requestConfig,
            status: 200,
            statusText: 'OK',
            headers: {},
            request: {}
          });
          return config;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // 响应拦截器 - 处理 Mock 请求和实际错误
    axiosInstance.interceptors.response.use(
      response => response,
      error => {
        // 如果是 Mock 请求且请求失败，直接返回 Mock 数据
        if (error.config && error.config.__isMockRequest && error.config.__mockData) {
          return Promise.resolve({ 
            data: error.config.__mockData,
            config: error.config,
            status: 200,
            statusText: 'OK',
            headers: {}
          });
        }
        return Promise.reject(error);
      }
    );
  }
}

// 导出单例
export default new MockService();
