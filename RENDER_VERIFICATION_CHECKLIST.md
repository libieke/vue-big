# ✅ Mock 数据渲染检查清单

## 🎯 目标
确保 Mock 数据能正确加载和渲染到页面上。

---

## 📊 数据修改清单

### ✏️ 已修改的文件

| 文件 | 修改内容 | 作用 |
|------|--------|------|
| `src/mock/data.js` | 调整 `mockHomeData` 结构 | 适配首页组件期望的数据格式 |
| `src/mock/index.js` | 修改 getHome 处理函数 | 支持分页参数并返回正确数据格式 |

### 📝 修改详情

#### 1. `src/mock/data.js`
**修改**: `mockHomeData` 数据结构

```javascript
// 修改前：返回统计数据
data: {
  totalDevices: 5,
  statistics: [...]
}

// 修改后：返回设备列表（适配页面）
data: {
  list: [
    { deviceId: '001', deviceName: '设备A', gpNum: 98, ... },
    { deviceId: '002', deviceName: '设备B', gpNum: 105, ... },
    // ... 更多设备
  ],
  pageMax: 1,
  totalDevices: 5
}
```

**包含字段**:
- `deviceId` - 设备ID
- `deviceName` - 设备名称
- `deviceState` - 状态（1:运行 2:停机 3:故障）
- `gpNum` - 良品数
- `ngNum` - 不良品数
- `gpRate` - 良品率
- `gpUrate` - 良品稼动率
- `purate` - 生产稼动率
- `pmtbf` - MTBF
- `maintenance` - 维护标志

#### 2. `src/mock/index.js`
**修改**: `getHome` 路由处理

```javascript
// 修改内容：
// 1. 支持 pageNo 和 pageSize 参数
// 2. 实现分页逻辑
// 3. 返回 pageMax 字段
// 4. 返回统计字段（totalDevices、runningDevices 等）
```

---

## 🚀 快速验证步骤

### 步骤 1：启动项目
```bash
npm run dev
# 或
pnpm dev
```

### 步骤 2：打开浏览器
- 访问应用地址（通常是 `http://localhost:8080`）
- 打开 F12 开发者工具

### 步骤 3：检查 Console
应该看到类似的日志：
```
✓ Mock 数据已启用
✓ Mock 工具函数已暴露到 window.__mockTools
```

### 步骤 4：在 Console 中验证
```javascript
// 1. 检查 Mock 状态
__mockTools.status()
// 输出: { enabled: true, message: '✓ Mock 数据已启用' }

// 2. 在 Console 中运行验证脚本
// 复制并粘贴 VERIFY_MOCK_DATA.js 中的代码
```

---

## 📋 页面级别检查

### ✅ 检查项 1：首页 - 运行状况
**URL**: `/` 或首页  
**路由名**: `operationStatus`  
**Expected Display**:
- [ ] 显示至少 4-5 个设备卡片
- [ ] 每张卡片显示设备名称
- [ ] 显示设备状态指示灯（运行/停机/故障）
- [ ] 显示良品数、不良数、良品率
- [ ] 显示良品稼动率、生产稼动率、MTBF
- [ ] 分页功能正常（当设备超过 8 个时）
- [ ] 点击卡片能跳转到生产信息页面

**调试命令**:
```javascript
// 检查数据是否加载
const mockService = require('@/mock/index').default;
const result = mockService.match('/wire/nk/getHome', 'POST', 
  { data: JSON.stringify({ pageNo: 1, pageSize: 8 }) });
console.log('首页数据:', result.data.data.list);
```

---

### ✅ 检查项 2：生产信息
**URL**: `/productionInformation?deviceId=001`  
**路由名**: `productionInformation`  
**Expected Display**:
- [ ] 表单中 3 个下拉菜单有选项
- [ ] 日期选择器能正常打开
- [ ] 查询按钮能触发数据加载
- [ ] 表格显示生产数据列表
- [ ] 右侧显示 OK/NG 统计数字
- [ ] 分页功能正常
- [ ] "数据导出" 按钮能点击

**调试命令**:
```javascript
// 检查工程类型
const mockService = require('@/mock/index').default;
const types = mockService.match('/wire/nk/tr/listDeviceType', 'POST', {});
console.log('工程类型:', types.data.data);
```

---

### ✅ 检查项 3：生产分析
**URL**: `/productAnalysis?deviceId=001`  
**路由名**: `productAnalysis`  
**Expected Display**:
- [ ] 显示不良品分析列表
- [ ] 显示 NG 分类统计
- [ ] 右侧显示 OK 总数、NG 总数、良品率等
- [ ] 控制图表正常显示
- [ ] 日期/批次选择能切换
- [ ] 分页功能正常
- [ ] 数据导出按钮可用

**调试命令**:
```javascript
const mockService = require('@/mock/index').default;
const ng = mockService.match('/wire/nk/getProdInfoNg', 'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) });
console.log('不良品数据:', ng.data.data.list);
```

---

### ✅ 检查项 4：报警历史
**URL**: `/alarmHistory`  
**路由名**: `alarmHistory`  
**Expected Display**:
- [ ] 表单能选择工程、机型、设备等
- [ ] 日期选择器正常工作
- [ ] 表格显示报警历史数据
- [ ] 显示报警类型、等级、处理状态等
- [ ] 分页功能正常
- [ ] 导出按钮可用

**调试命令**:
```javascript
const mockService = require('@/mock/index').default;
const alarm = mockService.match('/wire/nk/tr/getAlarmHis', 'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) });
console.log('报警数据:', alarm.data.data.list);
```

---

### ✅ 检查项 5：报警分析
**URL**: `/alarmAnalysis`  
**路由名**: `alarmAnalysis`  
**Expected Display**:
- [ ] 表单能选择条件（工程、机型、设备等）
- [ ] 日期/批次单选按钮能切换
- [ ] 日期选择器在"日期"模式可用
- [ ] 批次输入框在"批次"模式可用
- [ ] 图表显示报警分析数据
- [ ] 表格显示列表数据
- [ ] 分页功能正常
- [ ] 导出按钮可用

**调试命令**:
```javascript
const mockService = require('@/mock/index').default;
const analysis = mockService.match('/wire/nk/tr/getAlarmAly', 'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) });
console.log('报警分析数据:', analysis.data.data.list);
```

---

### ✅ 检查项 6：维护设置
**URL**: `/maintainSettings`  
**路由名**: `maintainSettings`  
**Expected Display**:
- [ ] 表格显示维护设置列表
- [ ] 显示设备、维护类型、周期、状态等信息
- [ ] 新增、修改、删除按钮可用
- [ ] 新增/修改对话框能正常打开
- [ ] 密码校验时输入 `123456` 能验证成功

**调试命令**:
```javascript
const mockService = require('@/mock/index').default;
const maintain = mockService.match('/wire/nk/tr/getProdLifeNum', 'POST', {});
console.log('维护设置:', maintain.data.data);

// 测试密码验证
const pwd = mockService.match('/wire/nk/tr/verifyPwd', 'POST',
  { data: JSON.stringify({ password: '123456' }) });
console.log('密码验证结果:', pwd.data);
```

---

## 🧪 综合测试

### 完整测试流程

1. **启动项目**：`npm run dev`
2. **打开首页**：确认看到设备卡片
3. **打开 Console**：确认 Mock 已启用
4. **运行验证脚本**：在 Console 中粘贴 `VERIFY_MOCK_DATA.js` 的内容
5. **逐个访问页面**：
   - 运行状况 → 检查设备卡片
   - 生产信息 → 选择设备后检查数据
   - 生产分析 → 检查图表和统计
   - 报警历史 → 检查报警列表
   - 报警分析 → 检查分析数据和图表
   - 维护设置 → 检查设置列表
6. **测试交互**：
   - 分页导航
   - 日期选择
   - 下拉菜单选择
   - 数据导出
   - 页面跳转

---

## ❌ 常见问题及解决方案

### 问题 1：没看到任何数据
**症状**: 页面显示空白或加载中  
**原因**: 
- Mock 未启用
- 接口未注册
- 数据格式不匹配

**解决**:
```javascript
// 1. 检查 Mock 是否启用
__mockTools.status()

// 2. 检查浏览器错误
// 打开 Console，查看是否有红色错误

// 3. 检查接口是否返回数据
const mockService = require('@/mock/index').default;
const result = mockService.match('/wire/nk/getHome', 'POST', {});
console.log(result);

// 4. 刷新页面
location.reload()
```

### 问题 2：设备卡片显示不全
**症状**: 某些字段显示为 "--"  
**原因**: 返回的数据字段不完整  
**解决**:
```javascript
// 检查返回的字段
const mockService = require('@/mock/index').default;
const result = mockService.match('/wire/nk/getHome', 'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 8 }) });
console.log('第一个设备数据:', result.data.data.list[0]);
```

### 问题 3：生产信息页面下拉菜单没有选项
**症状**: 工程、机型、设备下拉菜单为空  
**原因**: 列表接口未返回数据  
**解决**:
```javascript
// 检查各个列表接口
const mockService = require('@/mock/index').default;

const types = mockService.match('/wire/nk/tr/listDeviceType', 'POST', {});
console.log('工程类型:', types.data.data);

const versions = mockService.match('/wire/nk/tr/listDeviceVersion', 'POST', {});
console.log('机型:', versions.data.data);

const assets = mockService.match('/wire/nk/tr/listDeviceAssetNumber', 'POST', {});
console.log('设备资产:', assets.data.data);
```

### 问题 4：分页不工作
**症状**: 分页按钮无法点击或无反应  
**原因**: 
- pageMax 计算错误
- 分页逻辑不正确

**解决**:
```javascript
// 检查返回的分页信息
const mockService = require('@/mock/index').default;
const result = mockService.match('/wire/nk/getHome', 'POST',
  { data: JSON.stringify({ pageNo: 1, pageSize: 8 }) });
console.log('分页信息:', {
  total: result.data.data.total,
  pageMax: result.data.data.pageMax,
  pageSize: result.data.data.pageSize
});
```

### 问题 5：图表不显示
**症状**: 图表区域为空或显示空状态  
**原因**: 
- 图表库未正确初始化
- 返回数据不符合图表格式
- 需要选择设备后才能显示

**解决**:
```javascript
// 确保已选择设备（通过 URL 参数或下拉菜单）
// 检查控制图数据
const mockService = require('@/mock/index').default;
const ageing = mockService.match('/wire/nk/getAgeing', 'POST', {});
console.log('控制图数据:', ageing.data.data);
```

---

## 🔄 重启后的验证

如果进行了任何修改，完成以下步骤：

1. **完全关闭应用**
   - 停止开发服务器 (Ctrl+C)
   - 关闭浏览器窗口

2. **清理缓存**
   ```bash
   # 删除构建缓存
   rm -rf node_modules/.vite
   rm -rf node_modules/.cache
   ```

3. **重新启动**
   ```bash
   npm run dev
   ```

4. **清理浏览器缓存**
   - F12 打开开发者工具
   - Network 标签 → 勾选 "Disable cache"
   - Ctrl+Shift+Delete 清除缓存
   - Ctrl+F5 刷新页面

---

## 📞 调试信息收集

如果以上步骤后仍有问题，请提供以下信息：

```javascript
// 在 Console 中运行这个命令获取诊断信息
(function getDiagnostics() {
  const mockService = require('@/mock/index').default;
  const status = __mockTools.status();
  
  return {
    mockEnabled: status.enabled,
    registeredRoutes: mockService.routes.size,
    homeData: mockService.match('/wire/nk/getHome', 'POST', 
      { data: JSON.stringify({ pageNo: 1, pageSize: 8 }) }).code,
    browserUrl: window.location.href,
    timestamp: new Date().toISOString()
  };
})();

// 复制输出信息到文件提交
```

---

## ✅ 验证成功标志

当所有以下条件都满足时，表示 Mock 数据渲染成功：

- ✅ Console 显示 "✓ Mock 数据已启用"
- ✅ 首页显示至少 4-5 个设备卡片
- ✅ 生产信息页面能加载数据
- ✅ 报警页面能显示数据列表
- ✅ 分页功能正常工作
- ✅ 图表能正常显示
- ✅ 所有表单控件都有选项

---

**完成日期**: 2024-01-09  
**状态**: ✅ 就绪并可验证  

下一步：按照上述步骤逐项检查，确保所有页面都能正确显示 Mock 数据！🎉
