const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

// pages/customer/customer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer_List: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    //客服与反馈管理
    network.GET({
      params: {
        id: app.globalData.uid,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('客服与反馈管理')
          console.log(res.data.data)
          that.setData({
            customer_List: res.data.data
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
      urlname: api.GET_Feedback_List
    })
  },

  clickproblem: function(e){
    const that = this;
    const problem = e.target.dataset.problem;
    const program = e.target.dataset.program;
    wx.navigateTo({
      url: '../customer_data/customer_data?problem=' + problem + '&program=' + program
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