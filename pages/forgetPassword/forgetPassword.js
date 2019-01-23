const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const blue_Com = require('../../utils/bluetooth-command.js')
// pages/forgetPassword/forgetPassword.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceNo: '',
    Mobile_phone: '',
    Verification_code: '',
    localName: '',
    cupDeviceNo: '',
    deviceId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const deviceId = options.deviceId
    const localName = options.localName
    const cupDeviceNo = options.cupDeviceNo
    this.setData({
      localName: localName,
      cupDeviceNo: cupDeviceNo,
      deviceId: deviceId
    })
  },

  //填写设备号
  input_DeviceNo: function(e){
    this.setData({
      deviceNo: e.detail.value
    });
  },

  //填写电话号码
  Mobile_phone: function(e){
    this.setData({
      Mobile_phone: e.detail.value
    });
  },

  //获取验证码
  Verification_code: function (e) {
    this.setData({
      Verification_code: e.detail.value
    });
  },

  //获取验证码
  Card_Code: function () {
    const that = this
    network.POST({
      params: {
        phone: that.data.Mobile_phone,
        type: "REGISTER",
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          console.log(res.data.message)

        } else {
          //异常处理
          app.httpError(res.data.message)
        }
      },
      fail: function (res) {
        //异常处理
        app.httpError(res.message)
      },
      urlname: api.POST_send
    })
  },

  //确认
  requestFun: function(){
    const that = this
    network.GET({
      params: {
        uid: app.globalData.uid,
        deviceNo: 'A20180001',//that.data.deviceNo,
        phone: that.data.Mobile_phone,
        code: that.data.Verification_code,
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          console.log(res.data.message)
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            state:2,
            first_password: true,
            second_password: false,
            set_password: '请输入新密码',
            confirm_password: '请确认新密码',
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          //异常处理
          app.httpError(res.data.message)
        }
      },
      fail: function (res) {
        //异常处理
        app.httpError(res.message)
      },
      urlname: api.GET_find
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})