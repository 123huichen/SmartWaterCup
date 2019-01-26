// pages/cupMap/cupMap.js
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const blue_Com = require('../../utils/bluetooth-command.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    positioning:false,
    navigation:true,
    mylatitude: '',
    mylongitude: '',
    markers: [{
      iconPath: '../../image/cupweizhi.png',
      id: '',
      latitude: '',
      longitude: '',
      width: 30,
      height: 30
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: '#ccc',
      width: 2,
      dottedLine: false,
      borderColor:'#fff'
    }],
    controls: [{
      id: 1,
      iconPath: '../../image/re-locate.png',
      position: {
        left: 10,
        top: 20,
        width: 30,
        height: 30
      },
      clickable: true
    }],

    latitude: '',
    longitude: '',
  },


  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
    this.mapCtx.moveToLocation();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.mapCtx = wx.createMapContext('map');
    if (app.globalData.positioning_reminder){
      that.setData({
        positioning: app.globalData.positioning_reminder,
        navigation: false,
      })
    }
    
    
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        that.setData({
          mylatitude: res.latitude,
          mylongitude: res.longitude,
        })

        //获取最新离线记录
        network.GET({
          params: {
            cupDeviceNo: app.globalData.deviceNo,
          },
          success: function (res) {
            if (res.data.code == 200) {
              console.log('获取最新离线记录')
              console.log(res.data.data);
              console.log("104.11378824869792==" + res.data.data.longitude)
              that.setData({
                latitude: res.data.data.latitude,
                longitude: res.data.data.longitude,

                markers: [{
                  iconPath: '../../image/cupweizhi.png',
                  id: res.data.data.id,
                  latitude: res.data.data.latitude,
                  longitude: res.data.data.longitude,
                  width: 30,
                  height: 30
                }],
                // polyline: [{
                //   points: [
                //     {
                //       latitude: res.data.data.latitude,
                //       longitude: res.data.data.longitude,
                //     }, 
                //     {
                //       longitude: that.data.mylongitude,
                //         latitude: that.data.mylatitude,
                //     }
                //   ],
                //   color: '#ccc',
                //   width: 2,
                //   dottedLine: false,
                //   borderColor: '#fff'
                // }],
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
          urlname: api.GET_offline
        })


      },
      fail(res) {
        console.log(res)
      }
    })

    
  },

  //开始导航
  start_Navigation: function(){
    const that = this;
    const latitude = parseFloat(that.data.latitude)
    const longitude = parseFloat(that.data.longitude)
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },

  //定位提醒
  positioning_Reminder: function(){
    const that = this;
    var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.SEEK_CUP,null)
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
        console.log("success  指令发送成功");
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
      }
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