//接口地址
var API_URL = 'http://xv.sitofang.top/cup/api';  //测试
//var API_URL = '';  //正式

//水杯管理
var POST_Ucp = '/cup/'; //更改密码
var GET_find = '/cup/find'; //找回密码
var GET_get = '/cup/get'; //获取我的水杯
var POST_init = '/cup/init'; //初始化水杯
var POST_validate = '/cup/validate'; //水杯校验

//授权管理
var POST_authorization = '/authorization/'; //授权

//好友添加管理
var POST_add = '/apply/add'; //好友添加申请
var POST_handle = '/apply/handle'; //处理好友申请
var GET_list = '/apply/list'; //获取添加消息列表

//水杯记录管理
var POST_record = '/cup/record/'; //添加水杯记录

//历史详情管理
var GET_detail = '/drink/detail/'; //获取历史详情

//健康生活管理
var GET_health_life = '/health/life';

//烧水记录管理
var POST_history = '/drink/history/'; //保存烧水记录

//饮水类型管理
var GET_temperature = '/drink/temperature/'; //获取饮水类型（首页）

//好友圈管理
var GET_Friend_List = '/friend/list'; //获取已添加好友列表
var GET_Friend_Number = '/friend/number'; //获取好友数量
var GET_Friend_Ranking_list = '/friend/ranking/list'; //获取好友圈排行

//验证码功能管理
var POST_send = '/message/send'; //发送验证码

//监控管理
var POST_monitor = '/monitor/'; //水杯状态更新

//离线记录管理
var GET_offline = '/offline/'; //获取最新离线记录
var POST_offline = '/offline/'; //添加水杯离线记录

//计划饮水管理
var POST_Drink_Edit = '/program/drink/edit'; //更新计划饮水量和设置闹钟

//水杯闹钟管理
var GET_time = '/remind/time/'; //获取水杯闹钟

//客服与反馈管理
var GET_Feedback_List = '/service/feedback/list'

//设置管理
var GET_settings = '/settings/'; //获取我的设置
var POST_settings = '/settings/'; //更新设置
var POST_recovery = '/settings/recovery'; //恢复出厂设置

//用户信息管理
var POST_user = '/user/'; //注册
var GET_card = '/user/data/card'; //获取我的资料卡
var GET_center = '/user/personal/center'; //获取个人信息
var GET_search = '/user/search'; //搜索用户
var GET_update = '/user/update'; //修改资料
var POST_remind = '/user/remind'; //保存好友被提醒数据

module.exports = {
  API_URL: API_URL,

  //水杯管理
  POST_Ucp: POST_Ucp,
  GET_find: GET_find,
  GET_get: GET_get,
  POST_init: POST_init,
  POST_validate: POST_validate,

  //授权管理
  POST_authorization: POST_authorization,

  //好友添加管理
  POST_add: POST_add,
  POST_handle: POST_handle,
  GET_list: GET_list,

  //水杯记录管理
  POST_record: POST_record,

  //历史详情管理
  GET_detail: GET_detail,

  //健康生活管理
  GET_health_life: GET_health_life ,

  //烧水记录管理
  POST_history: POST_history,

  //饮水类型管理
  GET_temperature: GET_temperature,

  //好友圈管理
  GET_Friend_List: GET_Friend_List,
  GET_Friend_Number: GET_Friend_Number,
  GET_Friend_Ranking_list: GET_Friend_Ranking_list,

  //验证码功能管理
  POST_send: POST_send,

  //监控管理
  POST_monitor: POST_monitor,

  //离线记录管理
  GET_offline: GET_offline,
  POST_offline: POST_offline,

  //计划饮水管理
  POST_Drink_Edit: POST_Drink_Edit,

  //水杯闹钟管理
  GET_time: GET_time,

  //客服与反馈管理
  GET_Feedback_List: GET_Feedback_List,

  //设置管理
  GET_settings: GET_settings,
  POST_settings: POST_settings,
  POST_recovery: POST_recovery,

  //用户信息管理
  POST_user: POST_user,
  GET_card: GET_card,
  GET_center: GET_center,
  GET_search: GET_search,
  GET_update: GET_update,
  POST_remind: POST_remind
}