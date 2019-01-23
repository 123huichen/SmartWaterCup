const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

// pages/friend_Requests/friend_Requests.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friend_Avatar: '',
    sex: '',
    friend_Name: '',
    but_show: false
  },

  // current_Operating: function() {
  //   console.log(this)
  //   this.setData({
  //     but_show: true
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    console.log(options)
    let DataList = JSON.parse(options.DataList);

    that.setData({
      friend_list: DataList
    })
  },

  Agree_Refuse_But: function (e){
    const friendUid = e.target.dataset.id;
    const agree = e.target.dataset.name;
    console.log(friendUid)
    console.log(agree)
    const that = this;
    
    network.POST({
      params: {
        id: friendUid,
        agree: agree
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('')
          console.log(res.data.data)
          
          //同意或者拒绝刷新接口
          network.GET({
            params: {
              uid: app.globalData.uid,
            },
            success: function (res) {
              if (res.data.code == 200) {
                console.log('获取添加消息列表')
                console.log(res.data.data)
                that.setData({
                  friend_list: res.data.data,
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
            urlname: api.GET_list
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
      urlname: api.POST_handle
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