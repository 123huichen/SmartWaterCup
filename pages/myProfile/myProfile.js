const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')


// pages/myProfile/myProfile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    age: '',
    height: '',
    weight: '',
    agedata: '',
    heightdata: '',
    weightdata: '',
    name: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    //获取我的资料卡
    network.GET({
      params: {
        id: app.globalData.uid,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('获取我的资料卡')
          console.log(res.data.data)
          that.setData({
            age: res.data.data.age,
            height: res.data.data.height,
            weight: res.data.data.weight,
            name: app.globalData.userInfo.nickName
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
      urlname: api.GET_card
    }) 
  },

  agefun: function(e){
    this.setData({
      agedata: e.detail.value,
    })
  },

  heightfun: function (e) {
    this.setData({
      heightdata: e.detail.value,
    })
  },

  weightfun: function (e) {
    console.log(e)
    this.setData({
      weightdata: e.detail.value,
    })
  },

  form_submit: function(){
    const that = this;
    if (that.data.agedata == ""){
      that.data.agedata = that.data.age
    }
    if (that.data.heightdata == "") {
      that.data.heightdata = that.data.height
    }
    if (that.data.weightdata == "") {
      that.data.weightdata = that.data.weight
    }
    //修改资料
    network.POST({
      params: {
        age: that.data.agedata,
        height: that.data.heightdata,
        id: app.globalData.uid,
        name: that.data.name,
        weight: that.data.weightdata
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('修改资料')
          console.log(res.data.data)
          wx.showToast({
            title: '保存成功',
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
      urlname: api.GET_update
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