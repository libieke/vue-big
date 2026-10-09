/**
 * Mock 数据系统高级用法
 * ========================
 * 
 * 本文件展示了如何在更复杂的场景中使用 Mock 数据系统
 */

// ============================================================================
// 1. 条件性返回数据（基于请求参数）
// ============================================================================

/**
 * 示例：根据设备 ID 返回不同的数据
 */
export function conditionalMockResponse(config) {
  try {
    const { deviceId } = JSON.parse(config.data);
    
    const dataMap = {
      '001': {
        code: 200,
        message: '成功',
        data: { deviceName: '设备A', status: '运行中' }
      },
      '002': {
        code: 200,
        message: '成功',
        data: { deviceName: '设备B', status: '暂停' }
      },
      undefined: {
        code: 400,
        message: '设备 ID 不能为空',
        data: null
      }
    };
    
    return dataMap[deviceId] || dataMap['undefined'];
  } catch {
    return { code: 400, message: '参数错误', data: null };
  }
}

// ============================================================================
// 2. 延迟响应（模拟网络延迟）
// ============================================================================

/**
 * 示例：添加人工延迟来模拟真实网络环境
 */
export function delayedMockResponse(data, delayMs = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delayMs);
  });
}

// 使用方式：
// const result = await delayedMockResponse(mockData, 1000);

// ============================================================================
// 3. 随机数据生成
// ============================================================================

/**
 * 示例：生成随机的设备状态列表
 */
export function generateRandomDeviceStatus(count = 10) {
  const statuses = ['运行中', '暂停', '故障', '维护中'];
  const list = [];
  
  for (let i = 0; i < count; i++) {
    list.push({
      deviceId: `DEV-${String(i + 1).padStart(3, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      temperature: (50 + Math.random() * 30).toFixed(2),
      pressure: (8 + Math.random() * 4).toFixed(2),
      timestamp: new Date().toLocaleTimeString()
    });
  }
  
  return {
    code: 200,
    message: '成功',
    data: list
  };
}

// ============================================================================
// 4. 基于时间的动态数据
// ============================================================================

/**
 * 示例：根据当前时间返回不同的运行数据
 */
export function getTimeBasedData() {
  const hour = new Date().getHours();
  let efficiency, status;
  
  if (hour >= 9 && hour < 12) {
    efficiency = 95; // 上午效率高
    status = '运行良好';
  } else if (hour >= 12 && hour < 14) {
    efficiency = 75; // 中午休息时间
    status = '部分停止';
  } else if (hour >= 14 && hour < 18) {
    efficiency = 90; // 下午正常
    status = '运行良好';
  } else {
    efficiency = 80; // 晚上
    status = '正常运行';
  }
  
  return {
    code: 200,
    message: '成功',
    data: {
      currentHour: hour,
      efficiency: `${efficiency}%`,
      status: status,
      timestamp: new Date().toLocaleString('zh-CN')
    }
  };
}

// ============================================================================
// 5. 数据验证和错误处理
// ============================================================================

/**
 * 示例：验证请求数据并返回相应的错误
 */
export function validateAndRespond(config) {
  try {
    const { deviceId, startDate, endDate } = JSON.parse(config.data);
    
    // 验证必填字段
    if (!deviceId) {
      return {
        code: 400,
        message: '设备 ID 不能为空',
        data: null
      };
    }
    
    // 验证日期范围
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return {
          code: 400,
          message: '开始日期不能晚于结束日期',
          data: null
        };
      }
    }
    
    // 所有验证通过
    return {
      code: 200,
      message: '验证成功',
      data: { validated: true }
    };
  } catch (error) {
    return {
      code: 400,
      message: '请求格式错误',
      data: null
    };
  }
}

// ============================================================================
// 6. 会话数据持久化
// ============================================================================

/**
 * 示例：在 localStorage 中存储和检索模拟数据
 */
export class SessionDataManager {
  constructor(namespace = 'mock_data') {
    this.namespace = namespace;
  }
  
  set(key, value) {
    const storageKey = `${this.namespace}_${key}`;
    localStorage.setItem(storageKey, JSON.stringify(value));
  }
  
  get(key) {
    const storageKey = `${this.namespace}_${key}`;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  }
  
  remove(key) {
    const storageKey = `${this.namespace}_${key}`;
    localStorage.removeItem(storageKey);
  }
  
  clear() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.namespace)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

// 使用示例：
// const sessionData = new SessionDataManager();
// sessionData.set('currentUser', { id: 1, name: '张三' });
// const user = sessionData.get('currentUser');

// ============================================================================
// 7. 数据分页助手
// ============================================================================

/**
 * 示例：分页数据生成器
 */
export function paginate(data, pageNo = 1, pageSize = 10) {
  const total = data.length;
  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = data.slice(startIndex, endIndex);
  
  return {
    code: 200,
    message: '成功',
    data: {
      list,
      total,
      pageNo,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: pageNo < Math.ceil(total / pageSize),
      hasPreviousPage: pageNo > 1
    }
  };
}

// ============================================================================
// 8. 数据转换和映射
// ============================================================================

/**
 * 示例：将一种数据格式转换为另一种
 */
export function transformData(originalData, mappings) {
  return originalData.map(item => {
    const transformed = {};
    Object.keys(mappings).forEach(key => {
      const value = mappings[key];
      transformed[key] = typeof value === 'function' ? value(item) : item[value];
    });
    return transformed;
  });
}

// 使用示例：
// const original = [{ id: 1, name: '张三' }, { id: 2, name: '李四' }];
// const transformed = transformData(original, {
//   userId: 'id',
//   userName: 'name',
//   displayName: (item) => `用户: ${item.name}`
// });

// ============================================================================
// 9. 并发请求模拟
// ============================================================================

/**
 * 示例：模拟多个并发请求
 */
export async function concurrentRequests() {
  return Promise.all([
    new Promise(resolve => setTimeout(() => {
      resolve({ data: { code: 200, message: '请求1完成' } });
    }, 300)),
    new Promise(resolve => setTimeout(() => {
      resolve({ data: { code: 200, message: '请求2完成' } });
    }, 500)),
    new Promise(resolve => setTimeout(() => {
      resolve({ data: { code: 200, message: '请求3完成' } });
    }, 200))
  ]);
}

// ============================================================================
// 10. 文件导出模拟
// ============================================================================

/**
 * 示例：生成 CSV 格式数据（用于导出）
 */
export function generateCSV(headers, data) {
  // BOM 标识，用于正确显示中文
  let csv = '\uFEFF' + headers.join(',') + '\n';
  
  data.forEach(row => {
    csv += headers.map(header => {
      const value = row[header];
      // 如果值包含逗号或引号，需要用双引号包裹
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',') + '\n';
  });
  
  return csv;
}

// 使用示例：
// const csv = generateCSV(
//   ['日期', '数量', '状态'],
//   [
//     { '日期': '2024-01-01', '数量': 100, '状态': '正常' },
//     { '日期': '2024-01-02', '数量': 95, '状态': '正常' }
//   ]
// );

// ============================================================================
// 11. 在 Mock 服务中集成高级功能
// ============================================================================

/**
 * 示例：如何在 src/mock/index.js 中使用这些高级功能
 * 
 * 在 registerRoutes() 方法中：
 * 
 * // 条件性响应
 * this.register('/wire/api/device', 'POST', (config) => 
 *   conditionalMockResponse(config)
 * );
 * 
 * // 动态数据
 * this.register('/wire/api/status', 'POST', () =>
 *   getTimeBasedData()
 * );
 * 
 * // 验证请求
 * this.register('/wire/api/validate', 'POST', (config) =>
 *   validateAndRespond(config)
 * );
 * 
 * // 分页数据
 * this.register('/wire/api/list', 'POST', (config) => {
 *   const mockList = Array.from({ length: 100 }, (_, i) => ({
 *     id: i + 1,
 *     name: `项目 ${i + 1}`
 *   }));
 *   const { pageNo = 1, pageSize = 10 } = this.parseData(config.data);
 *   return paginate(mockList, pageNo, pageSize);
 * });
 */

// ============================================================================
// 12. 导出所有高级函数
// ============================================================================

export default {
  conditionalMockResponse,
  delayedMockResponse,
  generateRandomDeviceStatus,
  getTimeBasedData,
  validateAndRespond,
  SessionDataManager,
  paginate,
  transformData,
  concurrentRequests,
  generateCSV
};
