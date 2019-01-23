const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const md5 = require('../../utils/md5.js')

// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorize: true,
    sex: '', //性别
    time: 0, //已使用
    liter: 0, //饮用量
    percent: 0, //健康度
    personal_Name: '', //用户姓名
    personal_Avatar: '', //用户头像
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (app.globalData.userInfo) {
      let userInfo = app.globalData.userInfo;
      that.setData({
        authorize: app.globalData.authorize,
        personal_Name: userInfo.nickName,
        personal_Avatar: userInfo.avatarUrl,
        sex: userInfo.gender
      })
    } else if (that.data.canIUse) {
      console.log('page2');
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      // 给app.js 定义一个方法。
      app.userInfoReadyCallback = res => {
        console.log(res)
        let userInfo = res.userInfo;
        app.globalData.authorize = false;
        that.setData({
          personal_Name: userInfo.nickName,
          personal_Avatar: userInfo.avatarUrl,
          sex: userInfo.gender
        })
        app.getOP(res.userInfo)
      }
    }
  },
    

  //获取用户信息新接口
  agreeGetUser: function (e) {
    const that = this;
    //设置用户信息本地存储
    try {
      if (e.detail.errMsg == 'getUserInfo:fail auth deny') { //用户授权失败
        wx.showToast({
          title: '用户授权失败，请重新授权登录',
          icon: 'none',
          duration: 1500,
        })
        return;
      } else {
        wx.setStorageSync('userInfo', e.detail)
      }

    } catch (e) {
      wx.showToast({
        title: '系统提示:网络错误',
        icon: 'none',
        duration: 1500,
      })
    }
    console.log(e.detail)
    app.globalData.authorize = false;
    app.globalData.userInfo = e.detail.userInfo
    that.setData({
      authorize: true,
      personal_Name: e.detail.userInfo.nickName,
      personal_Avatar: e.detail.userInfo.avatarUrl,
      sex: e.detail.userInfo.gender 
    })
    app.getOP(e.detail.userInfo)
  },


  //跳转到我的资料页
  myData: function() {
    wx.navigateTo({
      url: '../myProfile/myProfile'
    })
  },
  //跳转到水杯定位
  waterCupLocation: function () {
    wx.navigateTo({
      url: '../cupMap/cupMap'
    })
  },
  //跳转到我得水杯
  myWaterCup: function () {
    wx.navigateTo({
      url: '../myCup/myCup'
    })
  },
  //跳转到客服与反馈
  customer: function () {
    wx.navigateTo({
      url: '../customer/customer'
    })
  },
  //跳转到设置页
  setting: function () {
    wx.navigateTo({
      url: '../setting/setting'
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
    const that = this
    if (app.globalData.userInfo){
      //获取个人信息
      network.GET({
        params: {
          id: app.globalData.uid,
        },
        success: function (res) {
          if (res.data.code == 200) {
            console.log(res)
            that.setData({
              time: res.data.data.timesUsed,
              liter: res.data.data.drunk,
              percent: res.data.data.health,
            })
          } else {
            //异常处理
            app.httpError(res.data.message)
          }
        },
        fail: function (res) {
          app.httpError(res.message)
        },
        urlname: api.GET_center
      })
    
    }
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