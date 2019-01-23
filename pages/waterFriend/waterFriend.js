const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

// pages/waterFriend/waterFriend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    li_avatar:'',
    searchData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    //获取已添加好友列表
    network.GET({
      params: {
        uid: app.globalData.uid,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('获取已添加好友列表')
          console.log(res.data.data)
          that.setData({
            li_avatar: res.data.data
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
      urlname: api.GET_Friend_List
    })
  },

  search_input: function(e){
    this.setData({
      searchData: e.detail.value
    });
  },

  //搜索
  search: function(){
    const that = this;    
    network.GET({
      params: {
        keyword: that.data.searchData,
      }, 
      success: function (res) {
        if (res.data.code == 200) {
          console.log('搜索')
          console.log(res.data.data)
          let str = JSON.stringify(res.data.data);
          wx.navigateTo({
            url: '../addWaterFriend/addWaterFriend?DataList=' + str,
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
      urlname: api.GET_search
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