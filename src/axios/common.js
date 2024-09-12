import request from "./index";
// const API = `/api`;

/**
 * 通用请求
 * @param {*} data
 * @returns
 */
// 查询工程列表
export function listDeviceType(data) {
  return request({
    url: `/nk/tr/listDeviceType`,
    method: "post",
    data,
  });
}

// 查询机型列表
export function listDeviceVersion(data) {
  return request({
    url: `/nk/tr/listDeviceVersion`,
    method: "post",
    data,
  });
}

// 查询机号列表
export function listDeviceAssetNumber(data) {
  return request({
    url: `/nk/tr/listDeviceAssetNumber`,
    method: "post",
    data,
  });
}

// 查询设备批次号
export function listPBatchNo(data) {
  return request({
    url: `/nk/tr/listPBatchNo`,
    method: "post",
    data,
  });
}

/**
 * 运行状况
 * @param {*} data
 * @returns
 */
export function getHome(data) {
  return request({
    url: `/nk/getHome`,
    method: "post",
    data,
  });
}

/**
 * 生产信息
 * @param {*} data
 * @returns
 */
// 分页查询列表
export function getProdInfo(data) {
  return request({
    url: `/nk/getProdInfo`,
    method: "post",
    data,
  });
}

// 导出
export function exportGetProdInfo(data) {
  return request({
    url: `/nk/export/getProdInfo`,
    method: "POST",
    data,
    responseType: "blob",
  });
}
/**
 * 生产分析
 * @param {*} data
 * @returns
 */
// 不良品的查询
export function getProdInfoNg(data) {
  return request({
    url: `/nk/getProdInfoNg`,
    method: "post",
    data,
  });
}

// 导出
// export function getAlarmHis(data) {
//   return request({
//     url: `/nk/tr/getAlarmHis`,
//     method: "get",
//     data,
//   });
// }

/**
 * 报警历史
 * @param {*} data
 * @returns
 */
// 分页查询报警历史记录列表
export function getAlarmHis(data) {
  return request({
    url: `/nk/tr/getAlarmHis`,
    method: "post",
    data,
  });
}

/**
 * 报警分析
 * @param {*} data
 * @returns
 */
// 分页查询报警分析列表
export function getAlarmAly(data) {
  return request({
    url: `/nk/tr/getAlarmAly`,
    method: "post",
    data,
  });
}

// 导出报警分析列表
export function exportAlarmAly(params) {
  return request({
    url: `/nk/tr/exportAlarmAly`,
    method: "get",
    params: params,
    responseType: "blob",
  });
}

/**
 * 维护设置
 * @param {*} data
 * @returns
 */
// 查询维护设置列表
export function getProdLifeNum(data) {
  return request({
    url: `/nk/tr/getProdLifeNum`,
    method: "post",
    data,
  });
}

// 维护设置重置维护时间;
export function resetServicingTime(data) {
  return request({
    url: `/nk/tr/resetServicingTime`,
    method: "post",
    data,
  });
}

// 维护设置密码校验
export function verifyPwd(data) {
  return request({
    url: `/nk/tr/verifyPwd`,
    method: "post",
    data,
  });
}

// 新增维护设置;
export function addProdLifeNum(data) {
  return request({
    url: `/nk/tr/addProdLifeNum`,
    method: "post",
    data,
  });
}

// 更新维护设置
export function updateProdTimeNum(data) {
  return request({
    url: `/nk/tr/updateProdTimeNum`,
    method: "post",
    data,
  });
}

// 删除维护设置
export function removeProdLife(data) {
  return request({
    url: `/nk/tr/removeProdLife`,
    method: "post",
    data,
  });
}
