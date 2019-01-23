const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 校验工具
 */
var validate = {
  // 判断是否为空
  isNotEmpty: function (verified) {
    return !validate.isEmpty(verified);
  },
  isEmpty: function (verified) {
    if (validate.isArray(verified)) {
      return (verified.length == 0);
    }

    if (!verified) {
      return true;
    }

    if (validate.isString(verified)
      && (verified === ""
        || verified === null
        || typeof verified === 'undefined')) {
      return true;
    }

    if (validate.isObject(verified)) {
      return (JSON.stringify(verified) == "{}");
    }

    return false;
  },
  isArray: function (verified) {
    return (Object.prototype.toString.call(verified) == '[object Array]');
  },
  isString: function (verified) {
    return (Object.prototype.toString.call(verified) === "[object String]");
  },
  isObject: function (verified) {
    return (Object.prototype.toString.call(verified).toLowerCase() == "[object object]");
  }
}

module.exports = {
  formatTime: formatTime,
  validate: validate
}
