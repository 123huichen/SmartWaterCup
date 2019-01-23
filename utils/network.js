//获取应用实例
const app = getApp();
const api = require('api.js')

var res;
var params = {};
var Path;

var requestHandler = {
  params: {},
  success: function (res) {
    // success
  },
  fail: function () {
    // fail
  },
  urlname: null
}

//地址拼接
function RequestPath(name) {
  Path = api.API_URL + name;
}

//GET请求
function GET(requestHandler) {
  let name = requestHandler.urlname
  RequestPath(name);
  request('GET', requestHandler);
}
//POST请求
function POST(requestHandler) {
  let name = requestHandler.urlname
  RequestPath(name);
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理
  var params = requestHandler.params;
  //添加加载动画
  // wx.showLoading({
  //     title: '加载中',
  //     mask: true
  // })
  wx.request({
    url: Path,
    data: params,
    method: method,
    success: function (res) {
      requestHandler.success(res)
    },
    fail: function () {
      requestHandler.fail()
      //httpError(status)
    },
    complete: function () {
      // complete
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}