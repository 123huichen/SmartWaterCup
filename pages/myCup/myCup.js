const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

// pages/myCup/myCup.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    mycup_list: '', //我的水杯列表
  }, 

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    //获取我的水杯
    network.GET({
      params: {
        uid: app.globalData.uid,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('获取我的水杯')
          console.log(res.data.data)
          that.setData({
            mycup_list: res.data.data
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
      urlname: api.GET_get
    })
  },

  restore_Settings: function (e) {
    const that = this;
    const deviceNo = e.currentTarget.dataset.deviceno;
    const bluetoothName = e.currentTarget.dataset.bluetoothname;
    const cupid = e.currentTarget.dataset.cupid;
    const color = e.currentTarget.dataset.color
    wx.navigateTo({
      url: `../restoreSettings/restoreSettings?deviceNo=${deviceNo}&bluetoothName=${bluetoothName}&cupid=${cupid}&color=${color}`
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