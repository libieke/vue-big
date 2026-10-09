/**
 * Mock 适配器 - 使用原生 axios 拦截器（无需安装额外依赖）
 * 用于截获axios请求，返回模拟数据
 */

import * as mockData from './data';

export function setupMockInterceptor(axiosInstance) {
  // 请求拦截器 - 用于匹配和拦截特定的 URL
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      // 如果请求失败，返回 mock 数据
      if (error.config && error.config.url) {
        return handleMockRequest(error.config);
      }
      return Promise.reject(error);
    }
  );

  // 添加响应拦截器来处理 mock 请求
  axiosInstance.interceptors.response.use(
    response => response,
    error => Promise.reject(error)
  );
}

/**
 * 处理 mock 请求的主函数
 */
function handleMockRequest(config) {
  const url = config.url;
  const method = config.method?.toUpperCase();
  
  // 工程类型列表
  if (url.includes('/nk/tr/listDeviceType') && method === 'POST') {
    return Promise.resolve({
      data: {
        code: 200,
        message: '成功',
        data: mockData.mockDeviceTypes
      }
    });
  }

  // 机型列表
  if (url.includes('/nk/tr/listDeviceVersion') && method === 'POST') {
    return Promise.resolve({
      data: {
        code: 200,
        message: '成功',
        data: mockData.mockDeviceVersions
      }
    });
  }

  // 设备资产编号列表
  if (url.includes('/nk/tr/listDeviceAssetNumber') && method === 'POST') {
    return Promise.resolve({
      data: {
        code: 200,
        message: '成功',
        data: mockData.mockDeviceAssetNumbers
      }
    });
  }

  // 批次号列表
  if (url.includes('/nk/tr/listPBatchNo') && method === 'POST') {
    return Promise.resolve({
      data: {
        code: 200,
        message: '成功',
        data: mockData.mockBatchNumbers
      }
    });
  }

  // 运行状况首页数据
  if (url.includes('/nk/getHome') && method === 'POST') {
    return Promise.resolve({
      data: mockData.mockHomeData
    });
  }

  // 生产信息列表
  if (url.includes('/nk/getProdInfo') && method === 'POST' && !url.includes('/export/')) {
    try {
      const { pageNo = 1, pageSize = 10 } = JSON.parse(config.data);
      return Promise.resolve({
        data: mockData.generateProdInfoList(pageNo, pageSize)
      });
    } catch {
      return Promise.resolve({
        data: mockData.generateProdInfoList()
      });
    }
  }

  // 生产分析 - 不良品数据
  if (url.includes('/nk/getProdInfoNg') && method === 'POST' && !url.includes('/export/')) {
    try {
      const { pageNo = 1, pageSize = 10 } = JSON.parse(config.data);
      return Promise.resolve({
        data: mockData.generateProdInfoNgList(pageNo, pageSize)
      });
    } catch {
      return Promise.resolve({
        data: mockData.generateProdInfoNgList()
      });
    }
  }

  // 报警历史列表
  if (url.includes('/nk/tr/getAlarmHis') && method === 'POST') {
    try {
      const { pageNo = 1, pageSize = 10 } = JSON.parse(config.data);
      return Promise.resolve({
        data: mockData.generateAlarmHistoryList(pageNo, pageSize)
      });
    } catch {
      return Promise.resolve({
        data: mockData.generateAlarmHistoryList()
      });
    }
  }

  // 报警分析列表
  if (url.includes('/nk/tr/getAlarmAly') && method === 'POST') {
    try {
      const { pageNo = 1, pageSize = 10 } = JSON.parse(config.data);
      return Promise.resolve({
        data: mockData.generateAlarmAnalysisList(pageNo, pageSize)
      });
    } catch {
      return Promise.resolve({
        data: mockData.generateAlarmAnalysisList()
      });
    }
  }

  // 维护设置列表
  if (url.includes('/nk/tr/getProdLifeNum') && method === 'POST') {
    return Promise.resolve({
      data: mockData.mockMaintainSettings
    });
  }

  // 控制图数据（不良品）
  if (url.includes('/nk/getAgeing') && method === 'POST') {
    return Promise.resolve({
      data: mockData.mockAgeingData
    });
  }

  // 密码校验
  if (url.includes('/nk/tr/verifyPwd') && method === 'POST') {
    try {
      const { password } = JSON.parse(config.data);
      if (password === '123456') {
        return Promise.resolve({
          data: {
            code: 200,
            message: '密码正确',
            data: { valid: true }
          }
        });
      }
      return Promise.resolve({
        data: {
          code: 401,
          message: '密码错误',
          data: { valid: false }
        }
      });
    } catch {
      return Promise.resolve({
        data: {
          code: 400,
          message: '参数错误',
          data: null
        }
      });
    }
  }

  // 重置维护时间
  if (url.includes('/nk/tr/resetServicingTime') && method === 'POST') {
    try {
      const data = JSON.parse(config.data);
      return Promise.resolve({
        data: {
          code: 200,
          message: '维护时间重置成功',
          data: {
            deviceId: data.deviceId,
            lastMaintenanceTime: new Date().toLocaleString('zh-CN'),
            nextMaintenanceTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN')
          }
        }
      });
    } catch {
      return Promise.resolve({
        data: {
          code: 400,
          message: '参数错误',
          data: null
        }
      });
    }
  }

  // 新增维护设置
  if (url.includes('/nk/tr/addProdLifeNum') && method === 'POST') {
    try {
      const data = JSON.parse(config.data);
      return Promise.resolve({
        data: {
          code: 200,
          message: '维护设置新增成功',
          data: {
            id: 'NEW_' + Date.now(),
            ...data,
            status: '正常'
          }
        }
      });
    } catch {
      return Promise.resolve({
        data: {
          code: 400,
          message: '参数错误',
          data: null
        }
      });
    }
  }

  // 更新维护设置
  if (url.includes('/nk/tr/updateProdTimeNum') && method === 'POST') {
    try {
      const data = JSON.parse(config.data);
      return Promise.resolve({
        data: {
          code: 200,
          message: '维护设置更新成功',
          data: data
        }
      });
    } catch {
      return Promise.resolve({
        data: {
          code: 400,
          message: '参数错误',
          data: null
        }
      });
    }
  }

  // 删除维护设置
  if (url.includes('/nk/tr/removeProdLife') && method === 'POST') {
    try {
      const { id } = JSON.parse(config.data);
      return Promise.resolve({
        data: {
          code: 200,
          message: '维护设置删除成功',
          data: { deletedId: id }
        }
      });
    } catch {
      return Promise.resolve({
        data: {
          code: 400,
          message: '参数错误',
          data: null
        }
      });
    }
  }

  // 都不匹配时，返回未拦截
  return Promise.reject(new Error('Mock 路由不匹配'));
}

/**
 * 备用：使用 axios-mock-adapter 的版本（需要额外依赖）
 * 可选使用
 */
export function setupMockAdapter(axiosInstance) {
  try {
    const MockAdapter = require('axios-mock-adapter').default;
    const mock = new MockAdapter(axiosInstance, { delayResponse: 200 });

    return executeMockSetup(mock);
  } catch (error) {
    console.warn('axios-mock-adapter 未安装，使用拦截器模式');
    return setupMockInterceptor(axiosInstance);
  }
}

function executeMockSetup(mock) {
  // ... 这里可以放置使用 MockAdapter 的具体配置
  return mock;
}
