const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const md5 = require('../../utils/md5.js')
const authorize_GET = require('../../utils/authorize.js')
const blue_Com = require('../../utils/bluetooth-command.js')
// pages/waterFriend/waterFriend.js

// authorize_GET.agreeGetUser()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorize: true,
    temperature: 0,  //温度
    Height: 100, 
    electricity: 0, //电量
    bluetooth_Name: '', //蓝牙名称
    currentData: 0,
    currentList: '',
    selected_Width: 236.8, 
    point_Left: 236.8,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    daily_Num: 0,  //slider value值
    slider_Min: 0,  //slider最小值
    slider_Max: 100,  //slider最大值

    daily_Numdata: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    app.globalData.sysinfo = wx.getSystemInfoSync()
    console.log('app.getSystem()=================>' + app.getSystem())

    if (app.globalData.userInfo) {
      that.setData({
        authorize: app.globalData.authorize,
      })
      app.getOP(app.globalData.userInfo)
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      // 给app.js 定义一个方法。
      app.userInfoReadyCallback = res => { 
        console.log(res)
        app.globalData.authorize = false;
        app.globalData.userInfo = res.userInfo;
        app.getOP(res.userInfo)
        that.setData({
          authorize: false,
        })
 
      }
    }

    //获取饮水类型（首页）
    network.GET({
      params: {},
      success: function (res) {
        if (res.data.code == 200) {
          console.log('获取饮水类型（首页）')
          console.log(res.data.data)
          for (var i = 0; i < res.data.data.length; i++){
            if (res.data.data[i].type == "沸水"){
              let Heightvalue = 100 - res.data.data[i].temperatureStart
              that.setData({
                daily_Num: res.data.data[i].temperatureStart, 
                slider_Max: res.data.data[i].temperatureEnd,
                temperature: res.data.data[i].temperatureStart,
                Height: Heightvalue,
              })
              app.globalData.boiling_water_type = 'BOILING_WATER'
            }
          }
          that.setData({
            currentList: res.data.data
          })
          
        } else {
          //异常处理
          app.httpError(res.data.message)
        }
      },
      fail: function (res) {
        app.httpError(res.message)
      },
      urlname: api.GET_temperature
    })
  },
  
  //获取用户信息新接口
  agreeGetUser: function (e) {
    const that = this
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
    console.log(e)
    app.globalData.authorize = false;
    app.globalData.userInfo = e.detail.userInfo
    that.setData({
      authorize: false,
    })

    app.getOP(e.detail.userInfo)
  },

  

  //获取当前滑块的index
  checkCurrent: function (e) {
    const that = this;
    console.log(e.currentTarget.dataset.type)
    console.log(e.currentTarget.dataset.temperaturestart)
    console.log(e.currentTarget.dataset.temperatureend)
    let Heightvalue = 100 - e.currentTarget.dataset.temperaturestart
    if (e.currentTarget.dataset.type == "沸水"){
      var water_type = 'BOILING_WATER'
    }
    if (e.currentTarget.dataset.type == "茶") {
      var water_type = 'TEA'
    }
    if (e.currentTarget.dataset.type == "咖啡") {
      var water_type = 'COFFEE'
    }
    if (e.currentTarget.dataset.type == "牛奶") {
      var water_type = 'MILK'
    }
    if (e.currentTarget.dataset.type == "自定义") {
      var water_type = 'CUSTOM'
    }
    that.setData({
      currentData: e.currentTarget.dataset.info,
      daily_Num: e.currentTarget.dataset.temperaturestart,
      temperature: e.currentTarget.dataset.temperaturestart,
      Height: Heightvalue,
    })
    app.globalData.boiling_water_type = water_type
  },


  findBluetooth: function () {
    if (app.getPlatform() == 'android' && this.versionCompare('6.5.7', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    }
    else if (app.getPlatform() == 'ios' && this.versionCompare('6.5.6', app.getVersion())) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请更新至最新版本',
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: '../findBluetooth/findBluetooth'
      })
    }
  },

  //滑块事件
  sliderchange: function (e) {
    this.data.daily_Numdata = this.addPreZero(e.detail.value);
    console.log(this.data.daily_Numdata);
    console.log('slider发生 change 事件，携带值为', e.detail.value)
    let Heightvalue = 100 - e.detail.value
    this.setData({
      temperature: e.detail.value,
      Height: Heightvalue,
    })
  },

  //滑块数值
  sliderchanging: function (e) {
    this.setData({
      daily_Num: e.detail.value
    })
  },

  //
  addPreZero: function (num) {
    if (num < 10) {
      return '00' + num;
    } else if (num < 100) {
      return '0' + num;
    } else {
      return num;
    }
  },

  //保存烧水记录
  save_Record: function(){
    const that = this;

    var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.PRESET_TEMPERATURE, that.data.daily_Numdata)
    console.log('buffer1--------------' + buffer1)
    var typedArray = new Uint8Array(buffer1.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))

    var buffer = typedArray.buffer
    console.log(buffer)

    wx.writeBLECharacteristicValue({
      deviceId: app.globalData.deviceId,
      serviceId: app.globalData.serviceId,
      characteristicId: app.globalData.cd02,
      value: buffer,
      success: function (res) {
        console.log("发送预设温度");
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    //定时器获取蓝牙名称
    const timeName = setInterval(function(){
      console.log('打开定时器---' + app.globalData.bluetoothName)
      
      if (app.globalData.bluetoothName){
        that.setData({
          bluetooth_Name: app.globalData.bluetoothName
        })
        clearInterval(timeName)
        console.log('关闭定时器')
      }
    }, 1000)

  },

  versionCompare: function (ver1, ver2) { //版本比较
    var version1pre = parseFloat(ver1)
    var version2pre = parseFloat(ver2)
    var version1next = parseInt(ver1.replace(version1pre + ".", ""))
    var version2next = parseInt(ver2.replace(version2pre + ".", ""))
    if (version1pre > version2pre)
      return true
    else if (version1pre < version2pre)
      return false
    else {
      if (version1next > version2next)
        return true
      else
        return false
    }
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