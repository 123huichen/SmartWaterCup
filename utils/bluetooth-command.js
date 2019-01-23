var util = require('util.js');
/**
 * 获取发送给水杯的数据包
 */
function getPacket (command, data_10) {
  var head = command_data.HEAD_CODE; // 基本头码，不变，16进制

  var data, data_length;
  if (util.validate.isEmpty(data_10)) {
    data_length = "00";
    data = "";
  } else {
    // 10进制数据转16进制
    data = dataTo16(data_10);

    // 数据长度，16进制 
    data_length = formatLength(data_10.length);
  }
  
  // 数据包 = 头码 + 数据长度 + 指令 + 数据 + 校验码
  var packet = head + data_length + command + data;

  // 数据包尾部添加校验码
  packet = packet + generateCode(packet);
  return packet;
}

/**
 * 校验水杯传递给小程序的入参是否正确的
 * 正确则返回true，错误则返回false
 */
function checkData(data) {
  var dataArray = getPacketArray(data);
  var code = getPacketXor(dataArray);
  if (code == command_data.CHECK_CODE) {
    return true;
  } else {
    return false;
  }
}

/**
 * 分解数据包的数据项
 */
function getPacketArray(data) {
  var dataArray = [];
  var item = "";
  // 拆分数据项
  for (var i = 1; i < data.length + 1; i++) {
    item = item + data[i - 1];
    if (i % 2 == 0) {
      dataArray.push(item);
      item = "";
    }
  }

  return dataArray;
}

/**
 * 获取数据包的异或运算结果
 */
function getPacketXor(dataArray) {
  var code = "";
  // 重头到尾做异或运算
  for (var j = 0; j < dataArray.length; j++) {
    var num = "0x" + dataArray[j];
    if (j == 0) {
      code = num;
      continue;
    }

    code = code ^ num;
  }

  return code;
}

/**
 * 生成校验码
 */
function generateCode (data) {
  var dataArray = getPacketArray(data);
  
  // 最后和校验码做异或运算
  var code = getPacketXor(dataArray) ^ command_data.CHECK_CODE;

  // 结果转成16进制
  code = code.toString(16).toUpperCase();
  return code;
}

function formatLength (data) {
  if (data < 10) {
    return "0" + data;
  }

  data = data.toString(16);
  return data;
}

function dataTo16 (str) {
  var data_ascii = "";
  // 转ASCII后，再转16进制
  for (var i = 0; i < str.length; i++) {
    data_ascii = data_ascii + str.charCodeAt(i).toString(16);
  }

  return data_ascii;
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

//解析水杯返回数据包
function hexCharCodeToStr(hexCharCodeStr) {
  　　var trimedStr = hexCharCodeStr.trim();
  　　var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  　　var len = rawStr.length;
  　　if (len % 2 !== 0) {
    　　　　alert("Illegal Format ASCII Code!");
    　　　　return "";
  　　}
  　　var curCharCode;
  　　var resultStr = [];
  　　for (var i = 6; i < len - 2; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  　　}
  　　return resultStr.join("");
}

var command_data = {
  "HEAD_CODE": "F0",
  "CHECK_CODE": "0xA5",
  // 小程序指令
  "WX": {
    "GET_NUMBER": "71", // 获取水杯设备号
    "SET_PASSWORD": "82", // 发送密码
    "CHANGE_PASSWORD": "87", // 更改密码 /设置密码
    "RESTORE_FACTORY": "80", //恢复出厂设置
    "PRESET_TEMPERATURE": "22", //预设温度
    "PRESET_WATER": "40", //预设喝水量
    "CUOYICUO": "50", //“搓一搓”提醒给水杯
    "REMINDER_TIME": "51", //喝水提醒时间
    "SEEK_CUP": "53", //寻找水杯
    "REMIND_WATER_FRIENDS": "90", //发送好友喝水提醒的蜂鸣器响/震动选项
    "TIMING_REMIND": "91", //发送定时喝水提醒的蜂鸣器响/震动选项 
    "CLEANING_REMINDER": "92", //发送清洗水杯提醒的蜂鸣器响/震动选项 
    "LOW_BATTERY_REMINDER": "93", //发送水杯电池电量低提醒的蜂鸣器响/震动选项
    "TEMPERATURE_HIGH_REMINDER": "94", //发送拿起水杯时水温过高提醒的蜂鸣器响/震动选项
    "INTERNET_TIME": "60", //发送互联网时间给水杯 
    
  },
  // 水杯指令
  "WC": {
    "DEVICENO": "7E", //水杯设备号 
    "SET_PASSWORD": "7A", //水杯设置密码完成后通知小程序
    "CONFIRM_PASSWORD": "7C", //水杯对比并确认密码后通知小程序
    "PASSWORD_INCORRECT": "73", //水杯检查密码不正确后通知小程序
    "RESTORE_FACTORY": "75", //水杯恢复出厂设置完成后通知小程序
    "RESEND_DATA": "77", //检验码不正确或小程序收到数据的校验码不正确后通知对方,要求数据重发
    "BATTERY_INFORMATION": "54", //水杯发送电量信息给小程序
    "COMING_SOON": "55", //水杯将即将关机（电池无电量）日期发给小程序
    "MORE_THAN_90": "56", //超过90度的事件对应的日期
    "MORE_THAN_80": "57", //超过80度且意外碰倒水杯的事件对应的日期
    "DRY_BURNING": "58", //水杯干烧的事件对应的日期
    "CLEANING": "59", //清洗水杯的事件对应的日期
    "FREE_FALL": "5A", //清洗水杯的事件对应的日期
    "NOW_TEMPERATURE": "11", //当前温度
    "SET_UP_TEMPERATURE": "21", //设定温度
    "NOW_DRINKING_WATER": "30", //当前喝水量
    "LOST_INFORMATION": "52", //
    "REJECT_PASSWORD_SETTINGS": "79", //水杯拒绝密码设置
  }
}

module.exports = {
  getPacket: getPacket,
  getPacketArray: getPacketArray,
  checkData: checkData,
  command_data: command_data,
  buf2hex: buf2hex,
  hexCharCodeToStr: hexCharCodeToStr
}