/**
 * Mock 适配器 - 使用 axios-mock-adapter 或自定义拦截器
 * 用于截获axios请求，返回模拟数据
 */

import MockAdapter from 'axios-mock-adapter';
import * as mockData from './data';

export function setupMockAdapter(axiosInstance) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 200 });

  /**
   * 工程类型列表
   */
  mock.onPost('/wire/nk/tr/listDeviceType').reply(() => {
    return [200, {
      code: 200,
      message: '成功',
      data: mockData.mockDeviceTypes
    }];
  });

  /**
   * 机型列表
   */
  mock.onPost('/wire/nk/tr/listDeviceVersion').reply(() => {
    return [200, {
      code: 200,
      message: '成功',
      data: mockData.mockDeviceVersions
    }];
  });

  /**
   * 设备资产编号列表
   */
  mock.onPost('/wire/nk/tr/listDeviceAssetNumber').reply(() => {
    return [200, {
      code: 200,
      message: '成功',
      data: mockData.mockDeviceAssetNumbers
    }];
  });

  /**
   * 批次号列表
   */
  mock.onPost('/wire/nk/tr/listPBatchNo').reply(() => {
    return [200, {
      code: 200,
      message: '成功',
      data: mockData.mockBatchNumbers
    }];
  });

  /**
   * 运行状况首页数据
   */
  mock.onPost('/wire/nk/getHome').reply(() => {
    return [200, mockData.mockHomeData];
  });

  /**
   * 生产信息列表
   */
  mock.onPost('/wire/nk/getProdInfo').reply((config) => {
    try {
      const { pageNo = 1, pageSize = 10 } = JSON.parse(config.data);
      return [200, mockData.generateProdInfoList(pageNo, pageSize)];
    } catch {
      return [200, mockData.generateProdInfoList()];
    }
  });

  /**
   * 生产分析 - 不良品数据
   */
  mock.onPost('/wire/nk/getProdInfoNg').reply((config) => {
    try {
      const { pageNo = 1, pageSize = 10 } = JSON.parse(config.data);
      return [200, mockData.generateProdInfoNgList(pageNo, pageSize)];
    } catch {
      return [200, mockData.generateProdInfoNgList()];
    }
  });

  /**
   * 报警历史列表
   */
  mock.onPost('/wire/nk/tr/getAlarmHis').reply((config) => {
    try {
      const { pageNo = 1, pageSize = 10 } = JSON.parse(config.data);
      return [200, mockData.generateAlarmHistoryList(pageNo, pageSize)];
    } catch {
      return [200, mockData.generateAlarmHistoryList()];
    }
  });

  /**
   * 报警分析列表
   */
  mock.onPost('/wire/nk/tr/getAlarmAly').reply((config) => {
    try {
      const { pageNo = 1, pageSize = 10 } = JSON.parse(config.data);
      return [200, mockData.generateAlarmAnalysisList(pageNo, pageSize)];
    } catch {
      return [200, mockData.generateAlarmAnalysisList()];
    }
  });

  /**
   * 维护设置列表
   */
  mock.onPost('/wire/nk/tr/getProdLifeNum').reply(() => {
    return [200, mockData.mockMaintainSettings];
  });

  /**
   * 控制图数据（不良品）
   */
  mock.onPost('/wire/nk/getAgeing').reply(() => {
    return [200, mockData.mockAgeingData];
  });

  /**
   * 密码校验
   */
  mock.onPost('/wire/nk/tr/verifyPwd').reply((config) => {
    try {
      const { password } = JSON.parse(config.data);
      // 模拟密码验证，模拟系统密码为 123456
      if (password === '123456') {
        return [200, {
          code: 200,
          message: '密码正确',
          data: { valid: true }
        }];
      }
      return [200, {
        code: 401,
        message: '密码错误',
        data: { valid: false }
      }];
    } catch {
      return [200, {
        code: 400,
        message: '参数错误',
        data: null
      }];
    }
  });

  /**
   * 重置维护时间
   */
  mock.onPost('/wire/nk/tr/resetServicingTime').reply((config) => {
    try {
      const data = JSON.parse(config.data);
      return [200, {
        code: 200,
        message: '维护时间重置成功',
        data: {
          deviceId: data.deviceId,
          lastMaintenanceTime: new Date().toLocaleString('zh-CN'),
          nextMaintenanceTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN')
        }
      }];
    } catch {
      return [200, {
        code: 400,
        message: '参数错误',
        data: null
      }];
    }
  });

  /**
   * 新增维护设置
   */
  mock.onPost('/wire/nk/tr/addProdLifeNum').reply((config) => {
    try {
      const data = JSON.parse(config.data);
      return [200, {
        code: 200,
        message: '维护设置新增成功',
        data: {
          id: 'NEW_' + Date.now(),
          ...data,
          status: '正常'
        }
      }];
    } catch {
      return [200, {
        code: 400,
        message: '参数错误',
        data: null
      }];
    }
  });

  /**
   * 更新维护设置
   */
  mock.onPost('/wire/nk/tr/updateProdTimeNum').reply((config) => {
    try {
      const data = JSON.parse(config.data);
      return [200, {
        code: 200,
        message: '维护设置更新成功',
        data: data
      }];
    } catch {
      return [200, {
        code: 400,
        message: '参数错误',
        data: null
      }];
    }
  });

  /**
   * 删除维护设置
   */
  mock.onPost('/wire/nk/tr/removeProdLife').reply((config) => {
    try {
      const { id } = JSON.parse(config.data);
      return [200, {
        code: 200,
        message: '维护设置删除成功',
        data: { deletedId: id }
      }];
    } catch {
      return [200, {
        code: 400,
        message: '参数错误',
        data: null
      }];
    }
  });

  /**
   * 导出生产信息
   */
  mock.onGet('/wire/nk/export/getProdInfo').reply(() => {
    // 返回假的CSV数据
    const csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF日期,总数量,OK数量,NG数量,良品率,不良品率\n2024-01-01,100,98,2,98%,2%\n2024-01-02,105,103,2,98.10%,1.90%';
    return [200, csvContent];
  });

  /**
   * 导出不良品分析数据
   */
  mock.onGet('/wire/nk/export/getProdInfoNg').reply(() => {
    const csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF日期,不良品类型,不良品代码,数量,占比\n2024-01-01,漏焊,NG0001,5,2.5%\n2024-01-01,虚焊,NG0002,3,1.5%';
    return [200, csvContent];
  });

  /**
   * 导出报警分析数据
   */
  mock.onGet('/wire/nk/tr/exportAlarmAly').reply(() => {
    const csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF日期,报警类型,次数,占比,解决率,平均解决时间\n2024-01-01,高温警告,10,5%,90%,120分钟\n2024-01-01,低压警告,8,4%,85%,150分钟';
    return [200, csvContent];
  });

  return mock;
}
