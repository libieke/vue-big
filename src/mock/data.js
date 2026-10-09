/**
 * Mock 数据 - 完整的数据对象
 */

// 工程类型数据
export const mockDeviceTypes = [
  { id: '1', name: '工程A' },
  { id: '2', name: '工程B' },
  { id: '3', name: '工程C' }
];

// 机型数据
export const mockDeviceVersions = [
  { version: 'V1.0', deviceTypeId: '1' },
  { version: 'V1.1', deviceTypeId: '1' },
  { version: 'V2.0', deviceTypeId: '2' },
  { version: 'V2.1', deviceTypeId: '2' }
];

// 设备资产编号
export const mockDeviceAssetNumbers = [
  { deviceId: '001', assetNumber: 'DEV-001', deviceTypeId: '1', version: 'V1.0' },
  { deviceId: '002', assetNumber: 'DEV-002', deviceTypeId: '1', version: 'V1.1' },
  { deviceId: '003', assetNumber: 'DEV-003', deviceTypeId: '2', version: 'V2.0' },
  { deviceId: '004', assetNumber: 'DEV-004', deviceTypeId: '2', version: 'V2.1' },
  { deviceId: '005', assetNumber: 'DEV-005', deviceTypeId: '3', version: 'V1.0' }
];

// 批次号数据
export const mockBatchNumbers = [
  { pbatchNo: 'BATCH-2024001', patchNo: 'BATCH-2024001', deviceId: '001' },
  { pbatchNo: 'BATCH-2024002', patchNo: 'BATCH-2024002', deviceId: '001' },
  { pbatchNo: 'BATCH-2024003', patchNo: 'BATCH-2024003', deviceId: '002' },
  { pbatchNo: 'BATCH-2024004', patchNo: 'BATCH-2024004', deviceId: '003' },
  { pbatchNo: 'BATCH-2024005', patchNo: 'BATCH-2024005', deviceId: '004' }
];

// 主页运行状况数据（设备列表）
export const mockHomeData = {
  code: 200,
  message: '成功',
  data: {
    list: [
      {
        deviceId: '001',
        deviceName: '设备A',
        deviceState: '1', // 1:运行 2:停机 3:故障
        gpNum: 98,
        ngNum: 2,
        gpRate: '98.00%',
        gpUrate: '95.5%',
        purate: '96.2%',
        pmtbf: '1260h',
        maintenance: false
      },
      {
        deviceId: '002',
        deviceName: '设备B',
        deviceState: '1',
        gpNum: 105,
        ngNum: 3,
        gpRate: '97.22%',
        gpUrate: '94.8%',
        purate: '95.5%',
        pmtbf: '1440h',
        maintenance: false
      },
      {
        deviceId: '003',
        deviceName: '设备C',
        deviceState: '1',
        gpNum: 110,
        ngNum: 4,
        gpRate: '96.49%',
        gpUrate: '97.2%',
        purate: '98.1%',
        pmtbf: '1680h',
        maintenance: true
      },
      {
        deviceId: '004',
        deviceName: '设备D',
        deviceState: '2', // 停机
        gpNum: 85,
        ngNum: 5,
        gpRate: '94.44%',
        gpUrate: '92.3%',
        purate: '93.7%',
        pmtbf: '960h',
        maintenance: false
      },
      {
        deviceId: '005',
        deviceName: '设备E',
        deviceState: '1',
        gpNum: 92,
        ngNum: 2,
        gpRate: '97.87%',
        gpUrate: '96.5%',
        purate: '97.3%',
        pmtbf: '1560h',
        maintenance: false
      }
    ],
    pageMax: 1,
    totalDevices: 5,
    runningDevices: 4,
    idleDevices: 1,
    faultDevices: 0
  }
};

// 生产信息数据
export const generateProdInfoList = (pageNo = 1, pageSize = 10) => {
  const list = [];
  const startIndex = (pageNo - 1) * pageSize;
  
  for (let i = startIndex; i < startIndex + pageSize; i++) {
    const sumNum = 100 + i * 10;
    const gpNum = 98 + i * 9;
    const ngNum = 2 + i;
    const gpRate = (gpNum / sumNum * 100).toFixed(2);
    const ngRate = (ngNum / sumNum * 100).toFixed(2);
    
    list.push({
      date: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
      sumNum: sumNum,
      gpNum: gpNum,
      ngNum: ngNum,
      gpRate: `${gpRate}%`,
      ngRate: `${ngRate}%`,
      fjNum: 0
    });
  }
  
  return {
    code: 200,
    message: '成功',
    data: list
  };
};

// 生产分析 - 不良品数据
export const generateProdInfoNgList = (pageNo = 1, pageSize = 10) => {
  const list = [];
  const startIndex = (pageNo - 1) * pageSize;
  const ngTypes = ['漏焊', '虚焊', '短路', '开路', '器件反装', '器件遗漏'];
  
  for (let i = startIndex; i < startIndex + pageSize; i++) {
    const quantity = Math.floor(Math.random() * 20) + 1;
    const percentage = ((quantity / 100) * 100).toFixed(2);
    
    list.push({
      context: ngTypes[i % ngTypes.length],
      num: quantity,
      ngRate: `${percentage}%`
    });
  }
  
  return {
    code: 200,
    message: '成功',
    data: {
      nkNgEnumRespList: list,
      total: 80,
      pageNo,
      pageSize,
      okNumL: 980,
      ngNum: 20,
      okRate: '98.00%',
      ngRate: '2.00%',
      fjNum: 5
    }
  };
};

// 报警历史数据
export const generateAlarmHistoryList = (pageNo = 1, pageSize = 10) => {
  const list = [];
  const startIndex = (pageNo - 1) * pageSize;
  const alarmTypes = [
    { code: 'ALM-001', name: '高温警告' },
    { code: 'ALM-002', name: '低压警告' },
    { code: 'ALM-003', name: '通信异常' },
    { code: 'ALM-004', name: '传感器故障' },
    { code: 'ALM-005', name: '运动异常' }
  ];
  
  for (let i = startIndex; i < startIndex + pageSize; i++) {
    const alarm = alarmTypes[i % alarmTypes.length];
    const day = String((i % 28) + 1).padStart(2, '0');
    const hour = String(i % 24).padStart(2, '0');
    const minute = String((i * 13) % 60).padStart(2, '0');
    list.push({
      id: i + 1,
      deviceWarningCode: alarm.code,
      deviceWarningName: alarm.name,
      startTime: `2024-01-${day} ${hour}:${minute}`,
      endTime: `2024-01-${day} ${String((Number(hour) + 1) % 24).padStart(2, '0')}:${minute}`,
      durationTime: `${(i % 8) + 1}分钟`
    });
  }
  
  return {
    code: 200,
    message: '成功',
    data: {
      list,
      total: 150,
      pageNo,
      pageSize
    }
  };
};

// 报警分析数据
export const generateAlarmAnalysisList = (pageNo = 1, pageSize = 10) => {
  const list = [];
  const startIndex = (pageNo - 1) * pageSize;
  const alarmTypes = ['高温警告', '低压警告', '通信异常', '传感器故障', '运动异常'];
  
  for (let i = startIndex; i < startIndex + pageSize; i++) {
    const count = (i % 8 + 1) * 12;
    list.push({
      deviceWarningCode: `ALM-${String((i % 5) + 1).padStart(3, '0')}`,
      deviceWarningName: alarmTypes[i % alarmTypes.length],
      warningCount: count,
      countPer: `${((count / 100) * 2).toFixed(2)}%`,
      durationTime: `${(i % 6 + 1) * 30}分钟`
    });
  }
  
  return {
    code: 200,
    message: '成功',
    data: list
  };
};

// 维护设置数据
export const mockMaintainSettings = {
  code: 200,
  message: '成功',
  data: [
    {
      id: '1',
      deviceId: '001',
      partName: '伺服电机',
      servicingTime: '2024-01-15',
      timeNum: 720,
      replacementSchedule: '75%'
    },
    {
      id: '2',
      deviceId: '002',
      partName: '导轨滑块',
      servicingTime: '2024-01-10',
      timeNum: 480,
      replacementSchedule: '45%'
    },
    {
      id: '3',
      deviceId: '003',
      partName: '气缸密封件',
      servicingTime: '2024-01-12',
      timeNum: 360,
      replacementSchedule: '60%'
    }
  ]
};

// 控制图数据（不良品）
export const mockAgeingData = {
  code: 200,
  message: '成功',
  data: {
    dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07'],
    values: [2.1, 1.8, 2.5, 1.9, 2.2, 1.7, 2.3],
    upperControl: 3.5,
    lowerControl: 0.5,
    centerLine: 2.0
  }
};
