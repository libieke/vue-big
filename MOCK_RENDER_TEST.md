## 📊 Mock 数据渲染测试指南

### ✅ 验证步骤

#### 1️⃣ 启动项目
```bash
npm run dev
# 或
pnpm dev
```

#### 2️⃣ 打开浏览器控制台
- 按 `F12` 打开开发者工具
- 切换到 Console 标签页

#### 3️⃣ 验证 Mock 已启用
在 Console 中应该看到日志：
```
✓ Mock 数据已启用
✓ Mock 工具函数已暴露到 window.__mockTools
```

#### 4️⃣ 在 Console 中运行验证命令

**基础验证**
```javascript
// 检查 Mock 状态
__mockTools.status()
// 输出应该是: { enabled: true, message: '✓ Mock 数据已启用' }
```

**测试首页数据**
```javascript
// 模拟获取首页数据
const mockService = require('@/mock/index').default;
const homeData = mockService.match(
  '/wire/nk/getHome',
  'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 8 }) }
);
console.log('首页设备列表:', homeData.data.list);
```

**测试生产信息**
```javascript
const mockService = require('@/mock/index').default;
const prodData = mockService.match(
  '/wire/nk/getProdInfo',
  'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) }
);
console.log('生产信息:', prodData.data.list);
```

**测试报警数据**
```javascript
const mockService = require('@/mock/index').default;
const alarmData = mockService.match(
  '/wire/nk/tr/getAlarmHis',
  'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) }
);
console.log('报警历史:', alarmData.data.list);
```

---

### 📱 页面显示检查

#### 页面 1：运行状况 (operationStatus)
**位置**：首页 → 运行状况  
**期望显示**：
- ✅ 5 个设备卡片（设备A~E）
- ✅ 每个卡片显示设备状态（运行/停机/故障）
- ✅ 良品数、不良数、良品率
- ✅ 良品稼动率、生产稼动率、MTBF

**检查命令**
```javascript
// 检查页面数据
console.log('当前设备列表:', __mockTools.status());
// 手动刷新页面查看数据渲染
```

#### 页面 2：生产信息
**位置**：首页 → 生产信息  
**期望显示**：
- ✅ 日期、总数量、OK数、NG数
- ✅ 良品率、不良率等统计信息
- ✅ 支持分页（每页10条）
- ✅ 数据表格和统计数字

#### 页面 3：生产分析
**位置**：首页 → 生产分析  
**期望显示**：
- ✅ 不良品分类列表
- ✅ NG 总数、OK 总数、良品率、不良品率
- ✅ 控制图表展示
- ✅ 支持分页

#### 页面 4：报警历史
**位置**：首页 → 报警历史  
**期望显示**：
- ✅ 报警类型、报警等级、时间
- ✅ 处理状态、处理人等信息
- ✅ 支持分页

#### 页面 5：报警分析
**位置**：首页 → 报警分析  
**期望显示**：
- ✅ 按日期展示报警数据
- ✅ 报警类型分布
- ✅ 解决率、平均解决时间
- ✅ 图表展示

#### 页面 6：维护设置
**位置**：首页 → 维护设置  
**期望显示**：
- ✅ 维护设置列表
- ✅ 设备维护周期、状态
- ✅ 支持增删改查操作

---

### 🔍 故障检查清单

#### 问题：页面没有显示任何数据

**检查步骤**：
```javascript
// 1. 检查 Mock 是否启用
__mockTools.status()

// 2. 检查浏览器是否有 JavaScript 错误
// F12 → Console 标签，查看红色错误信息

// 3. 检查网络请求
// F12 → Network 标签，查看请求是否成功

// 4. 手动调用 API 测试
const mockService = require('@/mock/index').default;
const result = mockService.match(
  '/wire/nk/getHome',
  'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 8 }) }
);
console.log('Mock 返回结果:', result);
```

**解决方案**：
1. 刷新页面：`Ctrl+F5` 或 `Cmd+Shift+R`
2. 清除缓存：`Ctrl+Shift+Delete`
3. 重启开发服务器
4. 检查 `.env.development` 中是否有 `VUE_APP_MOCK=true`

#### 问题：某个特定接口没有数据

**检查步骤**：
```javascript
// 检查该接口是否在 Mock 中注册
const mockService = require('@/mock/index').default;
console.log('所有注册的路由数量:', mockService.routes.size);

// 尝试匹配特定接口
const result = mockService.match(
  '/wire/nk/getProdInfo',
  'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) }
);
console.log('接口返回:', result);
```

**解决方案**：
1. 检查 `src/mock/index.js` 中是否注册了该路由
2. 通过 `registerRoutes()` 方法添加新的路由
3. 确认 URL 和 HTTP 方法匹配

#### 问题：数据行数不对

**可能原因**：
- 分页参数不正确
- Mock 数据定义的数据量不足

**检查和修改**：
```javascript
// 查看原始数据
const mockService = require('@/mock/index').default;
const config = { data: JSON.stringify({ pageNo: 1, pageSize: 100 }) };
const result = mockService.match('/wire/nk/getProdInfo', 'POST', config);
console.log('所有数据:', result.data.list);
```

---

### 🧪 批量测试脚本

在 Console 中运行这个脚本进行全面测试：

```javascript
(async () => {
  const mockService = require('@/mock/index').default;
  
  console.log('=== Mock 数据系统全面测试 ===\n');
  
  // 测试 1: 工程类型
  const types = mockService.match('/wire/nk/tr/listDeviceType', 'POST', {});
  console.log('✓ 工程类型:', types.data.data.length, '条');
  
  // 测试 2: 首页数据
  const home = mockService.match('/wire/nk/getHome', 'POST', 
    { data: JSON.stringify({ pageNo: 1, pageSize: 8 }) });
  console.log('✓ 首页设备:', home.data.data.list.length, '条');
  
  // 测试 3: 生产信息
  const prod = mockService.match('/wire/nk/getProdInfo', 'POST',
    { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) });
  console.log('✓ 生产信息:', prod.data.data.list.length, '条');
  
  // 测试 4: 报警历史
  const alarm = mockService.match('/wire/nk/tr/getAlarmHis', 'POST',
    { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) });
  console.log('✓ 报警历史:', alarm.data.data.list.length, '条');
  
  // 测试 5: 维护设置
  const maintain = mockService.match('/wire/nk/tr/getProdLifeNum', 'POST', {});
  console.log('✓ 维护设置:', maintain.data.data.length, '条');
  
  console.log('\n=== 所有接口测试完成 ===');
})();
```

---

### ✨ 快速调试技巧

#### 1. 在 Network 标签中查看请求
- 打开 F12 → Network 标签
- 刷新页面
- 查找 `/wire/` 开头的请求
- 点击请求查看 Headers、Preview、Response

#### 2. 在 Vue DevTools 中查看组件数据
- 安装 Vue DevTools 浏览器扩展
- 打开 F12 → Vue 标签
- 选择组件查看其 data 属性
- 验证数据是否正确加载

#### 3. 临时禁用 Mock 进行对比
```javascript
// 禁用 Mock
__mockTools.disable()
// 页面会尝试连接真实 API（会报错）

// 重新启用
__mockTools.enable()
```

---

### 📋 测试清单

完整验证前进行的检查项：

- [ ] Console 中有 "✓ Mock 数据已启用" 消息
- [ ] `__mockTools.status()` 返回 enabled: true
- [ ] 首页显示至少 4-5 个设备卡片
- [ ] 点击设备卡片能跳转到生产信息页面
- [ ] 生产信息页面显示数据列表和统计数字
- [ ] 报警页面显示报警数据和统计
- [ ] 分页功能正常工作
- [ ] 日期选择器能正常打开
- [ ] 数据导出按钮能正常工作
- [ ] 维护设置能进行增删改查操作

---

### 🎯 常见数据不显示的原因

| 原因 | 解决方案 |
|------|--------|
| Mock 未启用 | 检查 `.env.development` 设置 VUE_APP_MOCK=true |
| 接口未注册 | 在 `src/mock/index.js` 中添加路由 |
| 数据格式不匹配 | 查看组件期望的数据格式，调整 Mock 数据 |
| 缓存问题 | F12 → Network → Disable cache，然后刷新 |
| JavaScript 错误 | Console 中查看详细错误信息 |
| 网络错误 | 检查 baseURL 配置，确保为 `/api` 或正确的值 |

---

### 📞 调试 Tips

```javascript
// Tip 1: 查看某个组件发起的所有请求
// 在 Network 中 Filter 搜索 '/wire'

// Tip 2: 快速查看 Mock 数据源
import { mockDeviceTypes } from '@/mock/data';
console.log(mockDeviceTypes);

// Tip 3: 验证拦截器是否正常工作
// 在 Console 运行一个 API 调用：
const mockService = require('@/mock/index').default;
console.log('Mock 服务已加载:', mockService);

// Tip 4: 监视页面数据变化
// 在 Vue DevTools 中将鼠标悬停在组件上，
// 可以查看其实时 data、computed、props 等信息
```

---

**如果按照以上步骤操作后数据仍未显示，请提供：**
1. Console 中的完整错误信息
2. Network 标签中的请求 URL 和响应
3. 正在查看的具体页面名称
4. 浏览器类型和版本

祝调试顺利！🚀
