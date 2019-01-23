const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

// pages/addWaterFriend/addWaterFriend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data_list: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log(options) 
    let DataList = JSON.parse(options.DataList);
    
    that.setData({
      data_list: DataList
    })
  },

  //添加好友
  add_friend: function(e){
    const that = this;
    const friendUid = e.target.dataset.id;
    //好友添加申请
    network.POST({
      params: {
        uid: app.globalData.uid,
        friendUid: friendUid
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('好友添加申请')
          console.log(res)
          wx.showToast({
            title: '操作成功',
            icon: `none`,
            duration: 2000
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
      urlname: api.POST_add
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