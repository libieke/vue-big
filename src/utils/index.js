

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
import { Message } from "element-ui";
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  // 要展示的时间内容
  const format = cFormat || "{y}-{m}-{d} {a} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

export function isNullFormatter(data, emptyText) {
  if (data === null || data === "" || data === undefined) {
    return emptyText || "--";
  } else {
    return data;
  }
}

export function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

export function userAuthStatusFormatter(data) {
  if (data === 0 || data === "0") {
    return "否";
  } else if (data === 1 || data === "1") {
    return "是";
  } else {
    return "--";
  }
}
export function accountStatusFormatter(data) {
  if (data === 0 || data === "0") {
    return "正常";
  } else if (data === 1 || data === "1") {
    return "禁用";
  } else {
    return "--";
  }
}

export function beforeAvatarUpload(file) {
  const imgType = ["jpg", "jpeg", "png"];
  let judge = false; // 后缀
  const type = file.name.split(".")[file.name.split(".").length - 1];
  for (let k = 0; k < imgType.length; k++) {
    if (imgType[k].toUpperCase() === type.toUpperCase()) {
      judge = true;
      break;
    }
  }
  //   // 验证图片格式
  if (!judge) {
    Message.error("图片格式只支持：JPG、JPEG、PNG");
    return false;
  }
  const isLt1M = file.size / 1024 / 1024;
  if (isLt1M > 10) {
    Message.error("上传头像图片大小不能超过10MB");
    return false;
  }
  return true;
}

export const netContentUnit1 = ["克(g)", "毫升(ml)"];

export const netContentUnit2 = ["袋", "瓶", "箱"];

export const goodsDosageTypeList = [
  "水剂",
  "乳油",
  "悬浮剂",
  "助剂",
  "水乳剂",
  "可分散油悬浮剂",
  "水分散粒剂",
  "可湿性粉剂",
  "悬浮种衣剂",
];

export const defaultPng = "https://test.elongcom.com/agricoreadmin/default.png";

export const orderStatus = [
  {
    typeName: "全部",
    typeCode: null,
  },
  {
    typeName: "待确认",
    typeCode: "100",
  },
  {
    typeName: "待配送",
    typeCode: "2000",
  },
  {
    typeName: "配送中",
    typeCode: "2001",
  },
  {
    typeName: "已完成",
    typeCode: "9000",
  },
  {
    typeName: "已取消",
    typeCode: "9002",
  },
];

export function stateFmatter(data) {
  const thisItem = orderStatus.filter((item) => item.typeCode == data)[0];
  return thisItem.typeName || "";
}

export const orderStatus2 = [
  {
    typeName: "全部",
    typeCode: null,
  },
  {
    typeName: "提交订单",
    typeCode: "100",
  },
  {
    typeName: "确认订单",
    typeCode: "2000",
  },
  {
    typeName: "商品出库",
    typeCode: "2001",
  },
  {
    typeName: "订单完成",
    typeCode: "9000",
  },
  {
    typeName: "取消订单",
    typeCode: "9002",
  },
];

export function stateFmatter2(data) {
  const thisItem = orderStatus2.filter((item) => item.typeCode == data)[0];
  return thisItem.typeName || "";
}

export const payState = [
  {
    typeName: "未支付",
    typeCode: "notpay",
  },
  {
    typeName: "支付成功",
    typeCode: "success",
  },
  {
    typeName: "支付失败",
    typeCode: "failed",
  },
  {
    typeName: "支付关闭",
    typeCode: "close",
  },
];
export function payStateFiltrate(data) {
  if (!data) {
    return "";
  } else {
    const thisItem = payState.filter((item) => item.typeCode == data)[0];
    return thisItem.typeName || "";
  }
}
