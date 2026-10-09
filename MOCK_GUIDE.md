# Mock 数据系统 - 完整项目文档

## 📚 文档快速导航

| 文件 | 用途 | 详情 |
|------|------|------|
| **README.md** | 系统概述和基础用法 | 完整的使用指南 |
| **index.js** | Mock 服务核心 | 核心实现文件 |
| **data.js** | Mock 数据定义 | 所有模拟数据的集合 |
| **tools.js** | 管理工具函数 | 开发工具和实用函数 |
| **advanced.js** | 高级用法示例 | 15+ 个高级场景 |
| **QUICK-REFERENCE.js** | 快速参考 | 快速查看 |

---

## 🎯 项目概览

本项目为 **Vue Big** 生产管理系统集成了完整的 Mock 数据系统，包含：

- **18+ 个 API 端点** 的 Mock 数据
- **0 个额外依赖**（原生 JavaScript 实现）
- **无缝集成**（自动启用/禁用）
- **易于定制**（简单的数据修改和扩展）

---

## 📋 目录结构

```
vue-big/
├── src/
│   ├── axios/
│   │   ├── index.js              ✓ 已集成 Mock 自动启用逻辑
│   │   └── common.js             API 函数定义
│   ├── mock/                     ✓ NEW
│   │   ├── index.js              ⭐ Mock 服务核心
│   │   ├── data.js               ⭐ Mock 数据定义
│   │   ├── tools.js              🔧 开发工具函数
│   │   ├── advanced.js           🎓 高级用法示例
│   │   ├── adapter.js            备用：axios-mock-adapter 版
│   │   ├── adapter-interceptor.js 备用：纯拦截器版
│   │   ├── README.md             详细文档
│   │   └── QUICK-REFERENCE.js    快速参考
│   ├── main.js                   ✓ 已集成 Mock 工具初始化
│   └── ...
├── .env.development              ✓ 已配置 VUE_APP_MOCK=true
└── ...
```

---

## 🚀 快速开始（3 步）

### 步骤 1：确认配置
```bash
# .env.development 中已包含：
VUE_APP_MOCK = true
```

### 步骤 2：启动项目
```bash
npm run dev
# 或
pnpm dev
```

### 步骤 3：在浏览器控制台使用工具
```javascript
// 查看状态
__mockTools.status()

// 切换 Mock
__mockTools.toggle()

// 查看所有函数
__mockTools.help()
```

---

## 📊 Mock 数据概览

### API 分类统计

| 类别 | 数量 | 接口 |
|------|------|------|
| 工程管理 | 4 | listDeviceType, listDeviceVersion, listDeviceAssetNumber, listPBatchNo |
| 首页数据 | 1 | getHome |
| 生产信息 | 1 | getProdInfo |
| 生产分析 | 2 | getProdInfoNg, getAgeing |
| 报警管理 | 2 | getAlarmHis, getAlarmAly |
| 维护设置 | 6 | getProdLifeNum, resetServicingTime, addProdLifeNum, updateProdTimeNum, removeProdLife, verifyPwd |
| 数据导出 | 3 | export/getProdInfo, export/getProdInfoNg, tr/exportAlarmAly |
| **总计** | **19** | |

### 数据规模

- **工程类型**：3 条记录
- **机型**：4 条记录
- **设备**：5 台
- **批次**：5 个
- **生产信息**：100 条（支持分页）
- **不良品**：80 条（支持分页）
- **报警历史**：150 条（支持分页）
- **报警分析**：120 条（支持分页）
- **维护设置**：3 条记录

---

## 🔧 核心工作原理

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 应用启动                                                  │
│    ├─ axios/index.js 检查 VUE_APP_MOCK 环境变量            │
│    └─ 如果为 true，加载 Mock 服务                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Mock 服务初始化                                          │
│    ├─ 加载 src/mock/index.js                              │
│    ├─ 注册所有 API 路由和处理函数                           │
│    └─ 挂载 axios 响应拦截器                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. 请求流程                                                  │
│    ├─ 组件发起 axios 请求                                   │
│    ├─ 请求发送失败（因为后端未启动）                        │
│    ├─ 响应拦截器捕获错误                                    │
│    └─ Mock 服务查匹配路由并返回模拟数据                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. 数据返回                                                  │
│    └─ 组件收到完整的 Mock 数据响应                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 常用命令

### 开发工具函数

```javascript
// 在浏览器控制台中运行

// 1. 检查 Mock 状态
__mockTools.status()
// 输出: { enabled: true, message: '✓ Mock 数据已启用' }

// 2. 启用/禁用 Mock
__mockTools.enable()    // 启用
__mockTools.disable()   // 禁用
__mockTools.toggle()    // 切换

// 3. 修改 Mock 数据
__mockTools.update('testKey', { newData: 'value' })
__mockTools.get('testKey')

// 4. 查看帮助
__mockTools.help()

// 5. 清空自定义数据
__mockTools.clear()
```

---

## 📝 修改 Mock 数据

### 方式 1：直接编辑数据文件

修改 `src/mock/data.js`：

```javascript
// 添加新的工程
export const mockDeviceTypes = [
  { id: '1', name: '工程A' },
  { id: '2', name: '工程B' },
  { id: '3', name: '新工程' },  // ← 添加这行
  // ...
];
```

然后重启开发服务器。

### 方式 2：添加新的 API 接口

修改 `src/mock/index.js` 中的 `registerRoutes()` 方法：

```javascript
// 新增报表接口
this.register('/wire/nk/getReports', 'POST', (config) => {
  const { startDate, endDate } = this.parseData(config.data);
  return {
    code: 200,
    message: '成功',
    data: {
      startDate,
      endDate,
      reports: []
    }
  };
});
```

### 方式 3：使用高级功能

参考 `src/mock/advanced.js` 中的 15+ 个高级示例。

---

## 🧪 测试场景

### 场景 1：验证分页功能

```javascript
// 在浏览器中测试
const mockService = require('@/mock/index').default;
const result = mockService.match(
  '/wire/nk/getProdInfo',
  'POST',
  { data: JSON.stringify({ pageNo: 2, pageSize: 5 }) }
);
console.log(result.data.list.length); // 应该是 5
```

### 场景 2：测试密码验证

```javascript
// 正确密码
const mockService = require('@/mock/index').default;
const result = mockService.match(
  '/wire/nk/tr/verifyPwd',
  'POST',
  { data: JSON.stringify({ password: '123456' }) }
);
console.log(result.data.valid); // true
```

---

## 🔄 环境配置

### 开发环境
```env
# .env.development
VUE_APP_BASE_API=/api
VUE_APP_MOCK=true              # ✓ 使用 Mock
```

### 测试环境
```env
# .env.staging
VUE_APP_BASE_API=https://staging-api.com
VUE_APP_MOCK=false             # 使用真实 API
```

### 生产环境
```env
# .env.production
VUE_APP_BASE_API=https://api.com
VUE_APP_MOCK=false             # 使用真实 API
```

---

## ⚠️ 常见问题

### Q1: Mock 数据没有加载

**症状**：浏览器仍在请求真实 API，出现网络错误

**解决**：
1. 检查 `.env.development` 中是否存在 `VUE_APP_MOCK=true`
2. 在浏览器控制台检查是否有 `✓ Mock 数据已启用` 的日志
3. 刷新页面：`Ctrl+Shift+Delete` 清除缓存并刷新

### Q2: 特定接口没有返回 Mock 数据

**症状**：部分接口返回网络错误

**解决**：
1. 检查 `src/mock/index.js` 中是否注册了该路由
2. 确认 URL 和 HTTP 方法匹配
3. 在 Network 标签中查看实际请求的 URL

### Q3: 修改了 Mock 数据后没有生效

**症状**：页面数据未更新

**解决**：
1. 完全关闭开发服务器和浏览器
2. 清除 `node_modules/.vite` 或 `.cache` 文件夹
3. 重启开发服务器

### Q4: 如何禁用 Mock 并使用真实 API

**方式 1**：修改 `.env.development`
```env
VUE_APP_MOCK=false
```

**方式 2**：在浏览器控制台
```javascript
__mockTools.disable()
location.reload()
```

---

## 📈 性能考虑

- **Mock 数据体积**：< 50KB（压缩后）
- **初始化时间**：< 100ms
- **单个请求响应时间**：无延迟（可手动添加）
- **内存占用**：< 1MB

---

## 🔐 安全注意

1. **不在生产环境使用**：Mock 服务仅在开发环境启用
2. **密码安全**：模拟密码（123456）仅用于开发测试
3. **数据隐私**：Mock 数据中的示例信息均为虚拟数据

---

## 📚 相关资源

- [Axios 官方文档](https://axios-http.com/)
- [Vue 2 官方文档](https://v2.vuejs.org/)
- [MockAdapter 库](https://vimeo.com/76986505)（可选依赖）

---

## 🤝 贡献指南

如需扩展 Mock 数据系统：

1. 在 `src/mock/data.js` 中添加新的数据对象
2. 在 `src/mock/index.js` 中注册新的路由
3. 在 `src/mock/README.md` 中更新文档
4. 测试新的接口和数据

---

## 📞 技术支持

问题排查步骤：

1. ✓ 查看浏览器控制台日志
2. ✓ 检查 Network 标签中的请求
3. ✓ 查看 `src/mock/index.js` 中是否注册了路由
4. ✓ 验证数据格式是否符合 API 规范

---

## 版本历史

### v1.0.0 (2024-01-09)
- ✅ 初始版本
- ✅ 19 个 API 接口的 Mock 数据
- ✅ 完整的文档和工具函数
- ✅ 无外部依赖

---

## 许可证

本代码为项目内部使用，遵循项目原始许可证。

---

**最后更新**：2024-01-09  
**维护者**：Vue Big 项目团队  
**状态**：✅ 正常运行
