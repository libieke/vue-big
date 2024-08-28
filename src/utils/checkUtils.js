// 校验工具类

// ******************** 正则 ********************

// 手机号
export const REGEX_phone = /^1[3-9][0-9]{9}$/;
// 身份证
export const REGEX_IDCard =
  /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
// 邮箱
export const REGEX_email =
  /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
// 20字符以内，最多两位小数
export const REGEX_money = /^\d{1,20}(\.\d{1,2})?$/;
// 金额，3字符以内，最多两位小数
export const REGEX_number3 = /^\d{1,3}(\.\d{1,2})?$/;
// 纯数字，0-10位,最多两位小数
export const REGEX_number = /^\d{1,20}(\.\d{1,2})?$/;
// 纯数字，0-10位
export const REGEX_number1 = /^\d{0,10}$/;
// 纯数字，8位不重复数字
// export const REGEX_number8 = /^(?!\d*?(\d)\d*?\1)\d{1,8}$/;
export const REGEX_number8 = /^\d{1,8}$/;
// 正整数，年龄
export const REGEX_age = /^[1-9]\d*$/;
// 2-4位中文字符，姓名
export const REGEX_chinese = /^[\u4e00-\u9fa5]{2,4}$/;
// 用户名，字母或数字或下划线
export const REGEX_userName1 = /^w+$/;
// 用户名，4到16位字母，数字，下划线，减号
export const REGEX_userName2 = /^[a-zA-Z0-9_-]{4,16}$/;
// 用户名，只含有数字、字母、下划线不能以下划线开头和结尾：
export const REGEX_userName3 = /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/;
// 用户名，只含有汉字、数字、字母、下划线不能以下划线开头和结尾：
export const REGEX_userName4 = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
// 用户名，只含有汉字,0-20位汉字
export const REGEX_userName20 = /^[\u4e00-\u9fa5]{1,20}$/;
// 用户名，只含有汉字,0-10位汉字
export const REGEX_userName5 = /^[\u4e00-\u9fa5]{1,10}$/;
// 用户名，只含有汉字,0-50位汉字
export const REGEX_userName50 = /^[\u4e00-\u9fa5]{1,50}$/;
// 用户名，只含有汉字,0-300位汉字
export const REGEX_userName300 = /^[\u4e00-\u9fa5]{1,300}$/;
// 密码，长度至少为6，至少包含一个字母和一个数字
export const REGEX_pwd1 = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
// 密码，长度至少为8-20，且至少有一个数字 并同时包含大小写字母
export const REGEX_pwd2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
// 密码，长度至少为8，至少含有一个字母和一个数字和一个特殊字符
export const REGEX_pwd3 =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// 密码，长度至少为8,包含大小写字母、数字和特殊字符
export const REGEX_pwd4 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// 密码，长度8到16，包含大小写数字和特殊字符
export const REGEX_pwd5 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
// 图片，格式为png|jpg|jpeg|webp
export const REGEX_pic = /\.(png|jpg|gif|jpeg)$/;

// ******************** 正则验证 ********************

// 判断图片格式
export function isPic(value) {
  return REGEX_pic.test(value);
}

export function isUserName50(value) {
  return REGEX_userName50.test(value);
}

// 判断是否是手机号
export function isPhone(value) {
  return REGEX_phone.test(value);
}

// 判断是否是身份证号
export function isIDCard(value) {
  return REGEX_IDCard.test(value);
}

// 判断是否是邮箱
export function isEmail(value) {
  return REGEX_email.test(value);
}

// 判断是否是金额
export function isMoney(value) {
  return REGEX_money.test(value);
}

// 10位数字
export function isNumber(value) {
  return REGEX_number.test(value);
}

// 8位不重复数字
export function number8(value) {
  return REGEX_number8.test(value);
}

// 10位数字,保留两位小数
export function isNumber1(value) {
  return REGEX_number1.test(value);
}

// 判断是否是年龄
export function isAge(value) {
  return REGEX_age.test(value);
}
// 20字符以内，最多两位小数
export function iSnumber3(value) {
  return REGEX_number3.test(value);
}

// 判断是否是2-6位中文字符，姓名
export function isChinese(value) {
  return REGEX_chinese.test(value);
}

// 判断经纬度
// export function isLng(value) {
//   return REGEX_lng.test(value)
// }

// export function isLat(value) {
//   return REGEX_lat.test(value)
// }

// 判断是否是用户名
export function isUserName1(value) {
  return REGEX_userName1.test(value);
}
export function isUserName2(value) {
  return REGEX_userName2.test(value);
}
export function isUserName3(value) {
  return REGEX_userName3.test(value);
}
export function isUserName4(value) {
  return REGEX_userName4.test(value);
}
export function isUserName5(value) {
  return REGEX_userName5.test(value);
}
export function isUserName20(value) {
  return REGEX_userName20.test(value);
}
export function isUserName300(value) {
  return REGEX_userName300.test(value);
}
// 判断是否是密码
export function isPwd1(value) {
  return REGEX_pwd1.test(value);
}
export function isPwd2(value) {
  return REGEX_pwd2.test(value);
}
export function isPwd3(value) {
  return REGEX_pwd3.test(value);
}
export function isPwd4(value) {
  return REGEX_pwd4.test(value);
}
export function isPwd5(value) {
  return REGEX_pwd5.test(value);
}

// 表单校验

/**
 * 验证登录密码长度
 * @param {*} value
 * @param {*} callback
 */
export function validatePassword(rule, value, callback) {
  if (value.length < 6) {
    return callback(new Error("密码不能小于6位"));
  } else if (value.length > 20) {
    return callback(new Error("密码不能大于20位"));
  } else {
    return callback();
  }
}

/**
 * 验证登录密码长度
 * @param {*} value
 * @param {*} callback
 */
export function validatePwd(rule, value, callback) {
  if (value.length < 6) {
    return callback(new Error("密码不能小于6位"));
  } else if (value.length > 20) {
    return callback(new Error("密码不能大于20位"));
  } else if (isPwd1) {
    return callback(new Error("至少包含一个字母和一个数字"));
  } else {
    return callback();
  }
}

/*
  使用方法：

  import * as checkUtils from '@/utils/checkUtils'
  import { isPhone, isMoney } from '@/utils/checkUtils'

  console.log(checkUtils.REGEX_phone)
  console.log(checkUtils.isPhone('123'))
  console.log(isPhone('123'))

  */
