# Mock 数据系统 - 使用指南

## 📋 概述

这项目已集成 Mock 数据系统，用于在开发时替代真实的后端接口。无需额外依赖，开箱即用。

## 🚀 快速开始

### 方法 1：通过环境变量启用（推荐）

在 `.env.development` 文件中添加：
```
VUE_APP_MOCK=true
```

然后重启开发服务器。

### 方法 2：通过浏览器控制台动态启用

在浏览器控制台运行：
```javascript
localStorage.setItem('useMock', 'true');
location.reload();
```

关闭 mock：
```javascript
localStorage.removeItem('useMock');
location.reload();
```

## 📦 包含的 Mock 数据

### 1. **工程管理**
- `/nk/tr/listDeviceType` - 工程类型列表
- `/nk/tr/listDeviceVersion` - 机型列表
- `/nk/tr/listDeviceAssetNumber` - 设备资产编号列表
- `/nk/tr/listPBatchNo` - 批次号列表

### 2. **首页 - 运行状况**
- `/nk/getHome` - 获取首页运行状况数据
  - 设备总数、运行数、空闲数等统计信息
  - 各设备的生产信息

### 3. **生产信息**
- `/nk/getProdInfo` - 生产信息列表（支持分页）
  - 日期、总数量、OK数、NG数
  - 良品率、不良品率等

### 4. **生产分析**
- `/nk/getProdInfoNg` - 不良品分析列表（支持分页）
  - 不良品分类统计
  - OK总数、NG总数、良品率、不良品率
- `/nk/getAgeing` - 控制图数据
  - 包含上限、中线、下限的控制数据

### 5. **报警管理**
- `/nk/tr/getAlarmHis` - 报警历史列表（支持分页）
  - 报警类型、报警等级、处理状态等
- `/nk/tr/getAlarmAly` - 报警分析列表（支持分页）
  - 报警类型统计、解决率、平均解决时间

### 6. **维护设置**
- `/nk/tr/getProdLifeNum` - 维护设置列表
- `/nk/tr/resetServicingTime` - 重置维护时间
  - 模拟密码：`123456`
- `/nk/tr/addProdLifeNum` - 新增维护设置
- `/nk/tr/updateProdTimeNum` - 更新维护设置
- `/nk/tr/removeProdLife` - 删除维护设置
- `/nk/tr/verifyPwd` - 密码校验

### 7. **数据导出**
- `/nk/export/getProdInfo` - 导出生产信息
- `/nk/export/getProdInfoNg` - 导出不良品分析
- `/nk/tr/exportAlarmAly` - 导出报警分析

## 📁 文件结构

```
src/mock/
├── index.js              # Mock 服务主文件 (核心)
├── data.js              # Mock 数据定义
├── adapter.js           # axios-mock-adapter 版本（可选）
├── adapter-interceptor.js  # 拦截器版本（可选）
└── README.md            # 本文件
```

## 🔧 自定义 Mock 数据

### 修改现有数据

打开 `src/mock/data.js`，编辑相应的数据对象：

```javascript
// 工程类型数据
export const mockDeviceTypes = [
  { id: '1', name: '工程A' },
  { id: '2', name: '工程B' },
  // ... 添加更多
];
```

### 添加新的 Mock 路由

打开 `src/mock/index.js`，在构造函数的 `registerRoutes()` 方法中添加：

```javascript
// 新增报表接口
this.register('/wire/nk/getReport', 'POST', (config) => {
  return {
    code: 200,
    message: '成功',
    data: {
      // 你的 mock 数据结构
    }
  };
});
```

## 🧪 测试 Mock 数据

### 在浏览器控制台验证

```javascript
// 检查 mock 是否启用
console.log(localStorage.getItem('useMock'));

// 或在 Network 标签中查看请求
// 如果是 mock 数据，通常会显示本地响应
```

### 使用 API 测试工具

虽然 mock 数据默认拦截失败的请求，但可以在 `src/axios/index.js` 中修改为更激进的拦截方式：

```javascript
// 修改成主动拦截所有请求
axiosInstance.interceptors.request.use(config => {
  const mockResponse = mockService.match(config.url, config.method, config);
  if (mockResponse !== null) {
    return Promise.resolve({ data: mockResponse });
  }
  return config;
});
```

## 📝 环境变量配置

### `.env.development` (开发环境)
```
VUE_APP_BASE_API=/api
VUE_APP_MOCK=true     # 启用 mock
```

### `.env.staging` (测试环境)
```
VUE_APP_BASE_API=https://staging-api.example.com
VUE_APP_MOCK=false    # 禁用 mock
```

### `.env.production` (生产环境)
```
VUE_APP_BASE_API=https://api.example.com
VUE_APP_MOCK=false    # 禁用 mock
```

## 🔄 数据流程

```
请求流程：
axios 请求 → 请求拦截器 → 响应拦截器 → Mock 检查 → 
            ├─ 匹配到 Mock 路由 → 返回 Mock 数据
            └─ 未匹配 → 正常转发到后端
```

## ⚠️ 注意事项

1. **分页数据**：获取数据时会根据 `pageNo` 和 `pageSize` 生成不同的分页结果
2. **数据一致性**：Mock 数据是实时生成的，刷新页面后数据可能会变化
3. **密码验证**：维护设置中的密码校验，模拟密码是 `123456`
4. **导出功能**：导出接口返回的是模拟的 CSV 格式字符串

## 🐛 故障排除

### Mock 数据未加载

1. 检查 `.env.development` 文件中是否设置了 `VUE_APP_MOCK=true`
2. 检查浏览器控制台是否有错误信息
3. 查看浏览器控制台中是否打印了 "✓ Mock 数据已启用"

### 特定接口没有返回 Mock 数据

1. 检查 `src/mock/index.js` 中是否注册了该路由
2. 验证 URL 和 HTTP 方法是否正确
3. 如需添加新路由，参考上面的"添加新的 Mock 路由"部分

## 🎯 最佳实践

1. **在开发时启用 Mock**：避免依赖后端服务
2. **定期更新 Mock 数据**：当接口规范变化时更新 Mock 数据
3. **保留双份接口**：既支持 Mock 也支持真实 API
4. **使用环境变量控制**：不同环境用不同的 Mock 配置

## 📞 其他资源

- [原项目 package.json](../../package.json) - 查看项目依赖
- [Axios 文档](https://axios-http.com/) - Axios 官方文档
- [Vue 2 文档](https://v2.vuejs.org/) - Vue 2 官方文档

---

**版本**: 1.0.0  
**最后更新**: 2024-01-09
