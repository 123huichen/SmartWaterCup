const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    gender: '',
    age:'',
    height: '',
    body_weight: '',
    Mobile_phone: '',
    Verification_code: '',
    ver_code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      avatar:app.globalData.userInfo.avatarUrl
    })
  },

  gender: function(e){
    this.setData({
      gender: e.detail.value
    });
  },
  age: function (e) {
    this.setData({
      age: e.detail.value
    });
  },
  height: function (e) {
    this.setData({
      height: e.detail.value
    });
  },
  body_weight: function (e) {
    this.setData({
      body_weight: e.detail.value
    });
  },
  Mobile_phone: function (e) {
    this.setData({
      Mobile_phone: e.detail.value
    });
  },
  Verification_code: function (e) {
    this.setData({
      Verification_code: e.detail.value
    });
  },

  //获取验证码
  Card_Code: function(){
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

  formReset: function() {
    const that = this
    console.log('uid' + app.globalData.uid)
    var genderData = '';
    if (that.data.gender == "男"){
      genderData = 0;
    } else if (that.data.gender == "女") {
      genderData = 1;
    }
    network.POST({
      params: {
        id: app.globalData.uid,
        name: app.globalData.userInfo.nickName,
        sex: genderData,
        age: that.data.age,
        height: that.data.height,
        weight: that.data.body_weight,
        phone: that.data.Mobile_phone,
        code: that.data.Verification_code,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res)
          let drinkEnd = res.data.data.drinkEnd;
          let drinkStart = res.data.data.drinkStart
          let standardDrink = res.data.data.drinkStart
          wx.redirectTo({
            url: '../drinkingTarget/drinkingTarget?drinkEnd=' + drinkEnd + '&drinkStart=' + drinkStart + '&standardDrink=' + standardDrink
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
      urlname: api.POST_user
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