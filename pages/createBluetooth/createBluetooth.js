const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const blue_Com = require('../../utils/bluetooth-command.js')
// pages/createBluetooth/createBluetooth.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 1,
    first_password: true,
    second_password: false,
    set_password: '请设置密码',
    confirm_password: '请确认密码',
    localName: '',
    cupDeviceNo: '',
    first_password: true,
    second_password: false,
    deviceNo: '',
    deviceId: '',
    serviceId: '',
    services: [],
    cd01: '',
    cd02: '',
    cd03: '',
    characteristics01: null,
    characteristics02: null,
    characteristics03: null,
    advertisServiceUUIDs: null,

    settingpassword_data: '',
    confirmpassword_data: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options.verifyStatus == "Present"){
      that.setData({
        first_password: false,
        second_password: true,
      })
    } else {
      that.setData({
        first_password: true,
        second_password: false,
      })
    }
    const deviceId = options.deviceId
    const localName = options.localName
    const cupDeviceNo = options.cupDeviceNo
    app.globalData.deviceId = deviceId //设置全局deviceId
    that.setData({
      localName: localName,
      cupDeviceNo: cupDeviceNo,
      deviceId: deviceId
    })
    
    wx.createBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        console.log(res)
        wx.stopBluetoothDevicesDiscovery({
          success(res) {
            console.log('停止搜寻附近的蓝牙外围设备')
            console.log(res)
          }
        })

        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        /**
         * 连接成功，后开始获取设备的服务列表
         */
        wx.getBLEDeviceServices({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices中获取
          deviceId: that.data.deviceId,
          success: function (res) {
            console.log('device services:', res.services)
            that.setData({ services: res.services });
            console.log('device serviceId:', that.data.services[0].uuid);
            that.setData({ serviceId: that.data.services[0].uuid });
            console.log('--------------------------------------');
            console.log('device设备的id:', that.data.deviceId);
            console.log('device设备的服务id:', that.data.serviceId);
            app.globalData.serviceId = that.data.serviceId //serviceId
            /**
             * 延迟3秒，根据服务获取特征 
             */
            setTimeout(function () {
              wx.getBLEDeviceCharacteristics({
                // 这里的 deviceId 需要在上面的 getBluetoothDevices
                deviceId: that.data.deviceId,
                // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
                serviceId: that.data.serviceId,
                success: function (res) {
                  console.log('------------' + that.data.serviceId);
                  console.log('device getBLEDeviceCharacteristics:', res.characteristics);
                  that.setData({
                    cd01: res.characteristics[0].uuid, //读
                    cd02: res.characteristics[1].uuid, //写
                    cd03: res.characteristics[2].uuid, //读
                    characteristics01: res.characteristics[2],
                  });
                  app.globalData.cd02 = res.characteristics[1].uuid //设置全局cd02
                  /**
                   * 顺序开发设备特征notifiy
                   */
                  wx.notifyBLECharacteristicValueChanged({
                    deviceId: that.data.deviceId,
                    serviceId: that.data.serviceId,
                    characteristicId: that.data.cd01,
                    state: true,
                    success: function (res) {
                      console.log('顺序开发设备特征notifiy success', res);
                    },
                    fail: function (res) {
                      console.log('顺序开发设备特征notifiy----' + that.data.cd01);
                      console.log('顺序开发设备特征notifiy fail', res);
                    }
                  })

                  /**
                   * 顺序开发设备特征notifiy
                   */
                  wx.notifyBLECharacteristicValueChanged({
                    deviceId: that.data.deviceId,
                    serviceId: that.data.serviceId,
                    characteristicId: that.data.cd03,
                    state: true,
                    success: function (res) {
                      // success
                      console.log('顺序开发设备特征notifiy success', res);
                    },
                    fail: function (res) {
                      console.log('顺序开发设备特征notifiy---' + that.data.cd03);
                      console.log('顺序开发设备特征notifiy fail', res);
                    }
                  })
                  
                  /**
                   * 发送 数据到设备中
                   */
                  var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.GET_NUMBER, null)
                  console.log('buffer1--------------' + buffer1)
                  var typedArray = new Uint8Array(buffer1.match(/[\da-f]{2}/gi).map(function (h) {
                    return parseInt(h, 16)
                  }))

                  var buffer = typedArray.buffer
                  console.log(buffer)

                  wx.writeBLECharacteristicValue({
                    deviceId: that.data.deviceId,
                    serviceId: that.data.serviceId,
                    characteristicId: that.data.cd02,
                    value: buffer,
                    success: function (res) {
                      console.log("success  指令发送成功");
                      console.log(res);
                    },
                    fail: function (res) {
                      console.log(res);
                    },
                  })
                }, 
                fail: function (res) {
                  console.log(res);
                }
              })  
            }, 1500)      
          }
        })
      }
    })

    //接收数据
    wx.onBLECharacteristicValueChange(function (res) {
      console.log('接收数据')
      console.log('characteristic value comed:', blue_Com.buf2hex(res.value))
      wx.hideLoading({
        success:function(){
          console.log('隐藏 loading 提示框')
        }
      })

      let buffer = res.value
      let dataView = new DataView(buffer)
      let dataResult = []
      let operating_code
      console.log("dataView.byteLength", dataView.byteLength)
      for (let i = 0; i < dataView.byteLength; i++) {
        dataResult.push('0x' +dataView.getUint8(i).toString(16))
        if(i == 2){
          operating_code = dataView.getUint8(i).toString(16);
          operating_code = operating_code.toUpperCase();
          console.log(operating_code);
        }
      }
      const result = dataResult
      console.log(result)

      var resData = blue_Com.buf2hex(res.value);   
      console.log(blue_Com.hexCharCodeToStr(resData));  

      if (operating_code == blue_Com.command_data.WC.DEVICENO) {
       
        app.globalData.deviceNo = blue_Com.hexCharCodeToStr(resData);
        that.setData({
          deviceNo: blue_Com.hexCharCodeToStr(resData)
        })

      }
      if (operating_code == blue_Com.command_data.WC.SET_PASSWORD){

        //水杯设置
        let stringleng = 0;
        const timeName = setInterval(function () {
          if (stringleng == 8) {
            clearInterval(timeName)
          }
          console.log('打开定时器---' + stringleng)

          if (stringleng == 0) {
            var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.TEMPERATURE_HIGH_REMINDER, '1')
          }
          if (stringleng == 1) {
            var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.CLEANING_REMINDER, '1')
          }
          if (stringleng == 2) {
            var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.CLEANING_REMINDER, '3')
          }
          if (stringleng == 3) {
            var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.TIMING_REMIND, '1')
          }
          if (stringleng == 4) {
            var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.TIMING_REMIND, '3')
          }
          if (stringleng == 5) {
            var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.LOW_BATTERY_REMINDER, '1')
          }
          if (stringleng == 6) {
            var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.LOW_BATTERY_REMINDER, '3')
          }
          if (stringleng == 7) {
            var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.REMIND_WATER_FRIENDS, '1')
          }
          if (stringleng == 8) {
            var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.REMIND_WATER_FRIENDS, '3')
          }


          console.log('buffer2--------------' + buffer2)
          var typedArray = new Uint8Array(buffer2.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
          }))

          let buffer = typedArray.buffer
          console.log(buffer)

          wx.writeBLECharacteristicValue({
            deviceId: that.data.deviceId,
            serviceId: that.data.serviceId,
            characteristicId: that.data.cd02,
            value: buffer,
            success: function (res) {
              console.log("success设置指令发送成功");
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
            },
          })
          stringleng++
        },500)

        if (that.data.state == 1){
          //水杯设置密码成功
          network.POST({
            params: {
              deviceNo: that.data.deviceNo,
              password: that.data.settingpassword_data,
              uid: app.globalData.uid,
              advertisServiceUUIDs: that.data.deviceId
            },
            success: function (res) {
              if (res.data.code == 200) {
                console.log('设置密码')
                console.log(res.data.data);
                app.globalData.whetherBindCup = true
                wx.showToast({
                  title: '密码设置成功',
                  icon: `none`,
                  duration: 2000
                })
                console.log("缓存成功");
                wx.setStorage({
                  key: app.globalData.deviceNo,
                  data: that.data.settingpassword_data
                })
                wx.switchTab({
                  url: '../index/index'
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
            urlname: api.POST_init
          })
        } else {
          //水杯设置密码成功
          network.POST({
            params: {
              deviceNo: that.data.deviceNo,
              password: that.data.settingpassword_data,
              uid: app.globalData.uid,
              advertisServiceUUIDs: that.data.deviceId
            },
            success: function (res) { 
              if (res.data.code == 200) {
                console.log(res.data.data);
                wx.showToast({
                  title: '密码修改成功',
                  icon: `none`,
                  duration: 2000
                })
                console.log("缓存成功");
                wx.setStorage({
                  key: app.globalData.deviceNo,
                  data: that.data.settingpassword_data
                })
                wx.switchTab({
                  url: '../index/index'
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
            urlname: api.POST_Ucp
          })
        }
        
      }
      if (operating_code == blue_Com.command_data.WC.CONFIRM_PASSWORD){
        console.log('app.globalData.deviceNo' + app.globalData.deviceNo)
        console.log('that.data.settingpassword_data' + that.data.settingpassword_data)
        wx.setStorage({
          key: app.globalData.deviceNo,
          data: that.data.settingpassword_data
        })
        wx.showToast({
          title: '蓝牙已链接',
          icon: `none`,
          duration: 2000
        })
        wx.switchTab({
          url: '../index/index'
        })
      }

      if (operating_code == blue_Com.command_data.WC.PASSWORD_INCORRECT){
        wx.showToast({
          title: '密码错误',
          icon: `none`,
          duration: 2000
        })
      }

      if (operating_code == blue_Com.command_data.WC.REJECT_PASSWORD_SETTINGS) {
        wx.showToast({
          title: '水杯拒绝密码设置',
          icon: `none`,
          duration: 2000
        })
      }
    })
    
  },
  

  //请设置密码
  settingpassword: function(e){
    console.log('temperatureShock 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      settingpassword_data: e.detail.value,
    })
  },

  //请确认密码
  confirmpassword: function(e){
    console.log('temperatureShock 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      confirmpassword_data: e.detail.value,
    })
  },

  //忘记密码
  forget_Password: function () {
    wx.navigateTo({
      url: `../forgetPassword/forgetPassword?deviceId=${this.data.deviceId}&localName=${this.data.localName}&cupDeviceNo=${this.data.cupDeviceNo}`
    })
  },

  //设置密码
  requestFun: function(){
    const that = this;

    if (that.data.first_password){
      console.log('blue_Com.command_data.WX.CHANGE_PASSWORD' + blue_Com.command_data.WX.CHANGE_PASSWORD)
      var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.CHANGE_PASSWORD, that.data.settingpassword_data)
    } else {
      console.log('blue_Com.command_data.WX.SET_PASSWORD' + blue_Com.command_data.WX.SET_PASSWORD)
      var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.SET_PASSWORD, that.data.settingpassword_data)
    }
    
    console.log('buffer1--------------' + buffer1)
    var typedArray = new Uint8Array(buffer1.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))

    var buffer = typedArray.buffer
    console.log(buffer)

    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.cd02,
      value: buffer,
      success: function (res) {
        console.log("success  设置密码成功");
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    
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