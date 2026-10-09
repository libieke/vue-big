/**
 * Mock 数据快速验证脚本
 * 复制这个文件的内容，在浏览器 Console 中运行
 * 或保存为书签快速执行
 */

(function testMockData() {
  console.clear();
  console.log('%c========== Mock 数据系统快速验证 ==========', 'color: #00d8f4; font-size: 16px; font-weight: bold;');
  console.log('');

  // 1. 检查 Mock 工具是否可用
  console.log('%c1️⃣ 检查 Mock 工具...', 'color: #14cc8f; font-weight: bold;');
  if (typeof __mockTools !== 'undefined') {
    console.log('✅ Mock 工具已加载');
    const status = __mockTools.status();
    console.log(`   状态: ${status.message}`);
  } else {
    console.error('❌ Mock 工具不可用，请刷新页面');
    return;
  }
  console.log('');

  // 2. 获取 Mock 服务实例
  console.log('%c2️⃣ 加载 Mock 服务...', 'color: #14cc8f; font-weight: bold;');
  try {
    const mockService = require('@/mock/index').default;
    console.log('✅ Mock 服务已加载');
    console.log(`   已注册路由数: ${mockService.routes.size}`);
  } catch (e) {
    console.error('❌ Mock 服务加载失败:', e.message);
    return;
  }
  console.log('');

  // 3. 测试各个 API 接口
  console.log('%c3️⃣ 测试 API 接口数据...', 'color: #14cc8f; font-weight: bold;');
  console.log('');

  const mockService = require('@/mock/index').default;
  const testCases = [
    {
      name: '工程类型列表',
      url: '/wire/nk/tr/listDeviceType',
      method: 'POST',
      config: {},
      dataPath: 'data.data'
    },
    {
      name: '机型列表',
      url: '/wire/nk/tr/listDeviceVersion',
      method: 'POST',
      config: {},
      dataPath: 'data.data'
    },
    {
      name: '首页设备数据（分页）',
      url: '/wire/nk/getHome',
      method: 'POST',
      config: { data: JSON.stringify({ pageNo: 1, pageSize: 8 }) },
      dataPath: 'data.data.list'
    },
    {
      name: '生产信息列表',
      url: '/wire/nk/getProdInfo',
      method: 'POST',
      config: { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) },
      dataPath: 'data.data.list'
    },
    {
      name: '不良品分析',
      url: '/wire/nk/getProdInfoNg',
      method: 'POST',
      config: { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) },
      dataPath: 'data.data.list'
    },
    {
      name: '报警历史',
      url: '/wire/nk/tr/getAlarmHis',
      method: 'POST',
      config: { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) },
      dataPath: 'data.data.list'
    },
    {
      name: '报警分析',
      url: '/wire/nk/tr/getAlarmAly',
      method: 'POST',
      config: { data: JSON.stringify({ pageNo: 1, pageSize: 10 }) },
      dataPath: 'data.data.list'
    },
    {
      name: '维护设置',
      url: '/wire/nk/tr/getProdLifeNum',
      method: 'POST',
      config: {},
      dataPath: 'data.data'
    },
    {
      name: '控制图数据',
      url: '/wire/nk/getAgeing',
      method: 'POST',
      config: {},
      dataPath: 'data.data'
    }
  ];

  let successCount = 0;
  const results = [];

  testCases.forEach((testCase, index) => {
    try {
      const result = mockService.match(testCase.url, testCase.method, testCase.config);
      
      // 获取数据路径
      const parts = testCase.dataPath.split('.');
      let data = result;
      for (let part of parts) {
        data = data[part];
      }

      const itemCount = Array.isArray(data) ? data.length : (data ? 1 : 0);
      
      console.log(`%c${index + 1}. ${testCase.name}`, 'color: #dbfaff; font-weight: bold;');
      if (result.code || result.data) {
        console.log(`   ✅ 状态: 成功 (${result.code || 200})`);
        console.log(`   📊 数据: ${itemCount} 条`);
        if (result.data?.pageNo !== undefined) {
          console.log(`   📄 分页: 第 ${result.data.pageNo} 页，共 ${result.data.pageMax || Math.ceil(result.data.total / result.data.pageSize)} 页`);
        }
        results.push({
          name: testCase.name,
          status: '✅',
          count: itemCount,
          url: testCase.url
        });
        successCount++;
      } else {
        console.log(`   ❌ 返回数据不完整`);
        console.log(`   原始返回:`, result);
        results.push({
          name: testCase.name,
          status: '❌',
          count: 0,
          url: testCase.url
        });
      }
    } catch (error) {
      console.log(`%c${index + 1}. ${testCase.name}`, 'color: #eb5042; font-weight: bold;');
      console.log(`   ❌ 错误: ${error.message}`);
      results.push({
        name: testCase.name,
        status: '❌',
        count: 0,
        url: testCase.url,
        error: error.message
      });
    }
    console.log('');
  });

  // 4. 总结报告
  console.log('%c========== 测试总结 ==========', 'color: #00d8f4; font-size: 16px; font-weight: bold;');
  console.log(`✅ 成功: ${successCount}/${testCases.length}`);
  
  if (successCount === testCases.length) {
    console.log('%c🎉 所有接口都已成功加载，数据应该能正常显示！', 'color: #14cc8f; font-weight: bold;');
  } else {
    console.log('%c⚠️ 部分接口可能存在问题，请检查错误信息', 'color: #ffc232; font-weight: bold;');
  }

  console.log('');
  console.log('%c快速诊断命令:', 'font-weight: bold;');
  console.log('__mockTools.status()      // 查看 Mock 状态');
  console.log('__mockTools.help()        // 查看所有可用函数');
  console.log('location.reload()         // 刷新页面并重新加载数据');
  
  console.log('');
  console.log('%c详细结果表:', 'font-weight: bold; text-decoration: underline;');
  console.table(results);

  console.log('');
  console.log('%c========== 更多信息 ==========', 'color: #00d8f4; font-weight: bold;');
  console.log('📖 查看文档: MOCK_GUIDE.md');
  console.log('🧪 查看测试指南: MOCK_RENDER_TEST.md');
  console.log('📝 查看配置文件: src/mock/');

  // 返回结果对象，便于进一步处理
  return {
    success: successCount === testCases.length,
    successCount,
    totalCount: testCases.length,
    results
  };
})();

// 如果需要在其他地方使用结果，可以这样做：
// window.mockTestResult = testMockData(); 
// 然后通过 window.mockTestResult 访问结果
