/**
 * Mock 数据管理工具
 * 用于在开发过程中动态切换 Mock 数据的启用/禁用状态
 */

/**
 * 启用 Mock 数据
 */
export function enableMock() {
  localStorage.setItem('useMock', 'true');
  console.log('✓ Mock 数据已启用，请刷新页面');
  // 可选：自动刷新
  // location.reload();
}

/**
 * 禁用 Mock 数据
 */
export function disableMock() {
  localStorage.removeItem('useMock');
  console.log('✓ Mock 数据已禁用，请刷新页面');
  // 可选：自动刷新
  // location.reload();
}

/**
 * 检查 Mock 是否启用
 */
export function isMockEnabled() {
  return localStorage.getItem('useMock') === 'true';
}

/**
 * 切换 Mock 状态
 */
export function toggleMock() {
  if (isMockEnabled()) {
    disableMock();
  } else {
    enableMock();
  }
}

/**
 * 获取当前是否启用 Mock
 */
export function getMockStatus() {
  return {
    enabled: isMockEnabled(),
    message: isMockEnabled() ? 'Mock 数据已启用' : 'Mock 数据已禁用'
  };
}

/**
 * 修改特定 Mock 数据
 */
export function updateMockData(key, value) {
  const mockDataKey = `MOCK_DATA_${key}`;
  localStorage.setItem(mockDataKey, JSON.stringify(value));
  console.log(`✓ Mock 数据 ${key} 已更新`);
}

/**
 * 获取修改过的 Mock 数据
 */
export function getMockData(key) {
  const mockDataKey = `MOCK_DATA_${key}`;
  const data = localStorage.getItem(mockDataKey);
  return data ? JSON.parse(data) : null;
}

/**
 * 清空所有自定义 Mock 数据
 */
export function clearCustomMockData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('MOCK_DATA_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log('✓ 自定义 Mock 数据已清空');
}

/**
 * 在浏览器控制台中暴露工具函数
 */
export function exposeMockToolsToConsole() {
  if (typeof window !== 'undefined') {
    window.__mockTools = {
      enable: enableMock,
      disable: disableMock,
      toggle: toggleMock,
      status: getMockStatus,
      update: updateMockData,
      get: getMockData,
      clear: clearCustomMockData,
      help: () => {
        console.log(`
        ========== Mock 工具函数 ==========
        __mockTools.enable()      - 启用 Mock
        __mockTools.disable()     - 禁用 Mock
        __mockTools.toggle()      - 切换 Mock
        __mockTools.status()      - 查看 Mock 状态
        __mockTools.update(key, value) - 更新 Mock 数据
        __mockTools.get(key)      - 获取 Mock 数据
        __mockTools.clear()       - 清空自定义 Mock 数据
        __mockTools.help()        - 显示帮助信息
        ==================================
        `)
      }
    };
    console.log('✓ Mock 工具函数已暴露到 window.__mockTools');
    console.log('使用 __mockTools.help() 查看所有可用函数');
  }
}

export default {
  enableMock,
  disableMock,
  isMockEnabled,
  toggleMock,
  getMockStatus,
  updateMockData,
  getMockData,
  clearCustomMockData,
  exposeMockToolsToConsole
};
