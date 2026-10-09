#!/usr/bin/env node

/**
 * Mock 数据系统快速参考
 * ========================
 * 
 * 生成的文件清单
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║           Vue Big - Mock 数据系统快速参考                      ║
╚════════════════════════════════════════════════════════════════╝

📦 生成的文件结构：
─────────────────────────────────────────────────────────────────

src/mock/
  ├── 📄 index.js                 ✓ Mock 服务主文件（核心）
  ├── 📄 data.js                  ✓ Mock 数据定义
  ├── 📄 tools.js                 ✓ Mock 管理工具
  ├── 📄 adapter.js               ✓ axios-mock-adapter 版本（可选）
  ├── 📄 adapter-interceptor.js   ✓ 拦截器版本（可选）
  └── 📄 README.md                ✓ 详细文档

.env.development                  ✓ 已配置 VUE_APP_MOCK=true
src/main.js                       ✓ 已集成 Mock 工具

─────────────────────────────────────────────────────────────────

🚀 快速开始：
─────────────────────────────────────────────────────────────────

1️⃣  开发服务器已自动启用 Mock（通过 .env.development）
   
   npm run dev
   # 或
   pnpm dev

2️⃣  打开浏览器，在控制台使用工具函数：

   // 查看所有可用函数
   __mockTools.help()
   
   // 启用/禁用 Mock
   __mockTools.enable()
   __mockTools.disable()
   __mockTools.toggle()
   
   // 查看状态
   __mockTools.status()

3️⃣  刷新页面，应用会自动使用 Mock 数据

─────────────────────────────────────────────────────────────────

📋 包含的 Mock 接口（8 大类）：
─────────────────────────────────────────────────────────────────

✓ 工程管理 (4 个接口)
  - listDeviceType        工程类型列表
  - listDeviceVersion     机型列表
  - listDeviceAssetNumber 设备资产编号
  - listPBatchNo          批次号列表

✓ 首页数据 (1 个接口)
  - getHome               运行状况统计

✓ 生产信息 (1 个接口)
  - getProdInfo           生产信息列表（分页）

✓ 生产分析 (2 个接口)
  - getProdInfoNg         不良品分析（分页）
  - getAgeing             控制图数据

✓ 报警管理 (2 个接口)
  - getAlarmHis           报警历史（分页）
  - getAlarmAly           报警分析（分页）

✓ 维护设置 (5 个接口)
  - getProdLifeNum        维护设置列表
  - resetServicingTime    重置维护时间（密码：123456）
  - addProdLifeNum        新增维护设置
  - updateProdTimeNum     更新维护设置
  - removeProdLife        删除维护设置
  - verifyPwd             密码校验

✓ 其他接口 (2 个接口)
  - export/getProdInfo    导出生产信息
  - export/getProdInfoNg  导出不良品分析
  - tr/exportAlarmAly     导出报警分析

─────────────────────────────────────────────────────────────────

🔧 自定义 Mock 数据：
─────────────────────────────────────────────────────────────────

1. 修改已有数据：
   编辑 src/mock/data.js 中的对应数据对象

2. 添加新接口：
   打开 src/mock/index.js，在 registerRoutes() 中添加：
   
   this.register('/wire/api/path', 'POST', (config) => {
     return {
       code: 200,
       message: '成功',
       data: { /* 你的数据 */ }
     };
   });

3. 在控制台更新 Mock 数据：
   __mockTools.update('key', { /* 新数据 */ })

─────────────────────────────────────────────────────────────────

⚙️ 环境配置：
─────────────────────────────────────────────────────────────────

开发环境 (.env.development):
  VUE_APP_MOCK = true      # ✓ 启用 Mock

测试环境 (.env.staging):
  VUE_APP_MOCK = false     # 禁用 Mock（使用真实 API）

生产环境 (.env.production):
  VUE_APP_MOCK = false     # 禁用 Mock（使用真实 API）

─────────────────────────────────────────────────────────────────

💡 常见问题：
─────────────────────────────────────────────────────────────────

Q: Mock 数据没有加载？
A: 1. 检查 .env.development 中是否有 VUE_APP_MOCK=true
   2. 检查控制台是否有错误信息
   3. 查看是否打印了 "✓ Mock 数据已启用"

Q: 如何在特定接口返回错误？
A: 修改 src/mock/data.js 中的对应函数，返回：
   { code: 400, message: '错误信息', data: null }

Q: Mock 数据是否可以实时修改？
A: 可以，但需要重新启动开发服务器
   或使用 localStorage 存储自定义数据

Q: 如何打印 Mock 请求日志？
A: 在 src/mock/index.js 中添加日志输出

─────────────────────────────────────────────────────────────────

📖 详细文档：
   请查看 src/mock/README.md

─────────────────────────────────────────────────────────────────

✅ 设置完成！开始开发吧 🎉

`);
