const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const blue_Com = require('../../utils/bluetooth-command.js')

// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    antiScaldSound: false,
    clearShock:false,
    clearSound: false,
    drinkShock: false,
    drinkSound: false,
    electricityShock: false,
    electricitySound: false,
    friendShock: false,
    friendSound: false,
    lossPrevention: false,
    temperatureShock: false,
    temperatureSound: false,

    antiScaldSoundvalue: '',
    clearShockvalue: '',
    clearSoundvalue: '',
    drinkShockvalue: '',
    drinkSoundvalue: '',
    electricityShockvalue: '',
    electricitySoundvalue: '',
    friendShockvalue: '',
    friendSoundvalue: '',
    lossPreventionvalue: '',
    temperatureShockvalue: '',
    temperatureSoundvalue: '',
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;

    //获取我的设置
    network.GET({
      params: {
        cupDeviceNo: app.globalData.deviceNo,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('获取我的设置')
          console.log(res.data.data)
          var antiScaldSound_ = '';
          var clearShock_ = "";
          var clearSound_ = "";
          var drinkShock_ = "";
          var drinkSound_ = "";
          var electricityShock_ = "";
          var electricitySound_ = "";
          var friendShock_ = "";
          var friendSound_ = "";
          var lossPrevention_ = "";
          var temperatureShock_ = "";
          var temperatureSound_ = '';
          if (res.data.data.antiScaldSound == "0"){
            antiScaldSound_ = false
          }
          if (res.data.data.antiScaldSound == "1") {
            antiScaldSound_ = true
          }
          if (res.data.data.clearShock == "0") {
            clearShock_ = false
          }
          if (res.data.data.clearShock == "1") {
            clearShock_ = true
          }
          if (res.data.data.clearSound == "0") {
            clearSound_ = false
          }
          if (res.data.data.clearSound == "1") {
            clearSound_ = true
          }
          if (res.data.data.drinkShock == "0") {
            drinkShock_ = false
          }
          if (res.data.data.drinkShock == "1") {
            drinkShock_ = true
          }
          if (res.data.data.drinkSound == "0") {
            drinkSound_ = false
          }
          if (res.data.data.drinkSound == "1") {
            drinkSound_ = true
          }
          if (res.data.data.electricityShock == "0") {
            electricityShock_ = false
          }
          if (res.data.data.electricityShock == "1") {
            electricityShock_ = true
          }
          if (res.data.data.electricitySound == "0") {
            electricitySound_ = false
          }
          if (res.data.data.electricitySound == "1") {
            electricitySound_ = true
          }
          if (res.data.data.friendShock == "0") {
            friendShock_ = false
          }
          if (res.data.data.friendShock == "1") {
            friendShock_ = true
          }
          if (res.data.data.friendSound == "0") {
            friendSound_ = false
          }
          if (res.data.data.friendSound == "1") {
            friendSound_ = true
          }
          if (res.data.data.lossPrevention == "0") {
            lossPrevention_ = false
          }
          if (res.data.data.lossPrevention == "1") {
            lossPrevention_ = true
          }
          if (res.data.data.temperatureShock == "0") {
            temperatureShock_ = false
          }
          if (res.data.data.temperatureShock == "1") {
            temperatureShock_ = true
          }
          if (res.data.data.temperatureSound == "0") {
            temperatureSound_ = false
          }
          if (res.data.data.temperatureSound == "1") {
            temperatureSound_ = true
          }

          that.setData({
            antiScaldSound: antiScaldSound_,
            clearShock: clearShock_,
            clearSound: clearSound_,
            drinkShock: drinkShock_,
            drinkSound: drinkSound_,
            electricityShock: electricityShock_,
            electricitySound: electricitySound_,
            friendShock: friendShock_,
            friendSound: friendSound_,
            lossPrevention: lossPrevention_,
            temperatureShock: temperatureShock_,
            temperatureSound: temperatureSound_
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
      urlname: api.GET_settings
    })
  },

  antiScaldSoundchange: function(e) {
    console.log('antiScaldSound 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      antiScaldSoundvalue: e.detail.value
    })
  },

  clearShockchange: function (e) {
    console.log('clearShock 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      clearShockvalue: e.detail.value
    })
  },

  clearSoundchange: function (e) {
    console.log('clearSound 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },

  drinkShockchange: function (e) {
    console.log('drinkShock 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },

  drinkSoundchange: function (e) {
    console.log('drinkSound 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },

  electricityShockchange: function (e) {
    console.log('electricityShock 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      electricityShockvalue: e.detail.value
    })
  },

  electricitySoundchange: function (e) {
    console.log('electricitySound 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      electricitySoundvalue: e.detail.value
    })
  },

  friendShockchange: function (e) {
    console.log('friendShock 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      friendShockvalue: e.detail.value
    })
  },

  friendSoundchange: function (e) {
    console.log('friendSound 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      friendSoundvalue: e.detail.value
    })
  },

  lossPreventionchange: function (e) {
    console.log('lossPrevention 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      lossPreventionvalue: e.detail.value
    })
  },

  temperatureShockchange: function (e) {
    console.log('temperatureShock 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      temperatureShockvalue: e.detail.value
    })
  },

  temperatureSoundchange: function (e) {
    console.log('temperatureSound 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      temperatureSoundvalue: e.detail.value
    })
  },

  requestFun: function (name, changedata) {
    const that = this;
    if (that.data.antiScaldSoundvalue == ''){
      if (!that.data.antiScaldSound) {
        that.setData({
          antiScaldSoundvalue: 0
        })
      } else {
        that.setData({
          antiScaldSoundvalue: 1
        })
      }
    }
    if (that.data.clearShockvalue == '') {
      if (!that.data.clearShock){
        that.setData({
          clearShockvalue: 0
        })
      } else {
        that.setData({
          clearShockvalue: 1
        })
      }
    }
    if (that.data.clearSoundvalue == '') {
      if (!that.data.clearSound){
        that.setData({
          clearSoundvalue: 0
        })
      } else {
        that.setData({
          clearSoundvalue: 1
        })
      }
    }
    if (that.data.drinkShockvalue == '') {
      if (!that.data.drinkShock){
        that.setData({
          drinkShockvalue: 0
        })
      } else {
        that.setData({
          drinkShockvalue: 1
        })
      }
    }
    if (that.data.drinkSoundvalue == '') {
      if (!that.data.drinkSound){
        that.setData({
          drinkSoundvalue: 0
        })
      }else {
        that.setData({
          drinkSoundvalue: 1
        })
      }
    }
    if (that.data.electricityShockvalue == '') {
      if (!that.data.electricityShock) {
        that.setData({
          electricityShockvalue: 0
        })
      } else {
        that.setData({
          electricityShockvalue: 1
        })
      }
    }
    if (that.data.electricitySoundvalue == '') {
      if (!that.data.electricitySound) {
        that.setData({
          electricitySoundvalue: 0
        })
      } else {
        that.setData({
          electricitySoundvalue: 1
        })
      }
    }
    if (that.data.friendShockvalue == '') {
      if (!that.data.friendShock) {
        that.setData({
          friendShockvalue: 0
        })
      } else {
        that.setData({
          friendShockvalue: 1
        })
      }
    }
    if (that.data.friendSoundvalue == '') {
      if (!that.data.friendSound) {
        that.setData({
          friendSoundvalue: 0
        })
      } else {
        that.setData({
          friendSoundvalue: 1
        })
      }
      
    }
    if (that.data.lossPreventionvalue == '') {
      if (!that.data.lossPrevention) {
        that.setData({
          lossPreventionvalue: 0
        })
      } else {
        that.setData({
          lossPreventionvalue: 1
        })
      }
      
    }
    if (that.data.temperatureShockvalue == '') {
      if (!that.data.temperatureShock) {
        that.setData({
          temperatureShockvalue: 0
        })
      } else {
        that.setData({
          temperatureShockvalue: 1
        })
      }
      
    }
    if (that.data.temperatureSoundvalue == '') {
      if (!that.data.temperatureSound) {
        that.setData({
          temperatureSoundvalue: 0
        })
      } else {
        that.setData({
          temperatureSoundvalue: 1
        })
      }
      
    }

    if (that.data.antiScaldSoundvalue !== '') {
      if (!that.data.antiScaldSoundvalue) {
        that.setData({
          antiScaldSoundvalue: 0
        })
      } else {
        that.setData({
          antiScaldSoundvalue: 1
        })
      }
      
    }
    if (that.data.clearShockvalue !== '') {
      if (!that.data.clearShockvalue) {
        that.setData({
          clearShockvalue: 0
        })
      } else {
        that.setData({
          clearShockvalue: 1
        })
      }
      
    }
    if (that.data.clearSoundvalue !== '') {
      if (!that.data.clearSoundvalue) {
        that.setData({
          clearSoundvalue: 0
        })
      } else {
        that.setData({
          clearSoundvalue: 1
        })
      }
      
    }
    if (that.data.drinkShockvalue !== '') {
      if (!that.data.drinkShockvalue) {
        that.setData({
          drinkShockvalue: 0
        })
      } else {
        that.setData({
          drinkShockvalue: 1
        })
      }
      
    }
    if (that.data.drinkSoundvalue !== '') {
      if (!that.data.drinkSoundvalue) {
        that.setData({
          drinkSoundvalue: 0
        })
      } else {
        that.setData({
          drinkSoundvalue: 1
        })
      }
      
    }
    if (that.data.electricityShockvalue !== '') {
      if (!that.data.electricityShockvalue) {
        that.setData({
          electricityShockvalue: 0
        })
      } else {
        that.setData({
          electricityShockvalue: 0
        })
      }
      
    }
    if (that.data.electricitySoundvalue !== '') {
      if (!that.data.electricitySoundvalue) {
        that.setData({
          electricitySoundvalue: 0
        })
      } else {
        that.setData({
          electricitySoundvalue: 1
        })
      }
      
    }
    if (that.data.friendShockvalue !== '') {
      if (!that.data.friendShockvalue) {
        that.setData({
          friendShockvalue: 0
        })
      } else {
        that.setData({
          friendShockvalue: 1
        })
      }
      
    }
    if (that.data.friendSoundvalue !== '') {
      if (!that.data.friendSoundvalue) {
        that.setData({
          friendSoundvalue: 0
        })
      } else {
        that.setData({
          friendSoundvalue: 1
        })
      }
      
    }
    if (that.data.lossPreventionvalue !== '') {
      if (!that.data.lossPreventionvalue) {
        that.setData({
          lossPreventionvalue: 0
        })
      } else {
        that.setData({
          lossPreventionvalue: 1
        })
      }
      
    }
    if (that.data.temperatureShockvalue !== '') {
      if (!that.data.temperatureShockvalue) {
        that.setData({
          temperatureShockvalue: 0
        })
      } else {
        that.setData({
          temperatureShockvalue: 0
        })
      }
      
    }
    if (that.data.temperatureSoundvalue !== '') {
      if (!that.data.temperatureSoundvalue) {
        that.setData({
          temperatureSoundvalue: 0
        })
      } else {
        that.setData({
          temperatureSoundvalue: 0
        })
      }
      
    }
    var paramsdata = {
      antiScaldSound: that.data.antiScaldSoundvalue,
      clearShock: that.data.clearShockvalue,
      clearSound: that.data.clearSoundvalue,
      drinkShock: that.data.drinkShockvalue,
      drinkSound: that.data.drinkSoundvalue,
      electricityShock: that.data.electricityShockvalue,
      electricitySound: that.data.electricitySoundvalue,
      friendShock: that.data.friendShockvalue,
      friendSound: that.data.friendSoundvalue,
      lossPrevention: that.data.lossPreventionvalue,
      temperatureShock: that.data.temperatureShockvalue,
      temperatureSound: that.data.temperatureSoundvalue,
      cupDeviceNo: app.globalData.deviceNo
    }
    console.log(typeof paramsdata)
    network.POST({
      params: paramsdata,
      success: function (res) {
        if (res.data.code == 200) {
          console.log('保存')
          console.log(res.data.data)
          wx.showToast({
            title: '保存成功',
            icon: `none`,
            duration: 2000
          })

          //水杯设置
          let stringleng = 0;
          const timeName = setInterval(function () {
            if (stringleng == 8){
              clearInterval(timeName)
            }
            console.log('打开定时器---' + stringleng)
            if (stringleng == 0) {
              if (that.data.antiScaldSound) {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.TEMPERATURE_HIGH_REMINDER, '1')
              } else {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.TEMPERATURE_HIGH_REMINDER, '2')
              }
            }
            if (stringleng == 1) {
              if (that.data.clearShock) {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.CLEANING_REMINDER, '1')
              } else {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.CLEANING_REMINDER, '2')
              }
            }
            if (stringleng == 2) {
              if (that.data.clearSound) {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.CLEANING_REMINDER, '3')
              } else {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.CLEANING_REMINDER, '4')
              }
            }
            if (stringleng == 3) {
              if (that.data.drinkShock) {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.TIMING_REMIND, '1')
              } else {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.TIMING_REMIND, '2')
              }

            }
            if (stringleng == 4) {
              if (that.data.drinkSound) {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.TIMING_REMIND, '3')
              } else {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.TIMING_REMIND, '4')
              }

            }
            if (stringleng == 5) {
              if (that.data.electricityShock) {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.LOW_BATTERY_REMINDER, '1')
              } else {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.LOW_BATTERY_REMINDER, '2')
              }

            }
            if (stringleng == 6) {
              if (that.data.electricitySound) {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.LOW_BATTERY_REMINDER, '3')
              } else {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.LOW_BATTERY_REMINDER, '4')
              }

            }
            if (stringleng == 7) {
              if (that.data.friendShock) {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.REMIND_WATER_FRIENDS, '1')
              } else {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.REMIND_WATER_FRIENDS, '2')
              }

            }
            if (stringleng == 8) {
              if (that.data.friendSound) {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.REMIND_WATER_FRIENDS, '3')
              } else {
                var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.REMIND_WATER_FRIENDS, '4')
              }

            }


            console.log('buffer2--------------' + buffer2)
            var typedArray = new Uint8Array(buffer2.match(/[\da-f]{2}/gi).map(function (h) {
              return parseInt(h, 16)
            }))

            let buffer = typedArray.buffer
            console.log(buffer)

            wx.writeBLECharacteristicValue({
              deviceId: app.globalData.deviceId,
              serviceId: app.globalData.serviceId,
              characteristicId: app.globalData.cd02,
              value: buffer,
              success: function (res) {
                console.log("success设置指令发送成功");
                console.log(res);
              },
              fail: function (res) {
                console.log(res);
              },
            });
            stringleng++
          }, 500)


        } else {
          //异常处理
          app.httpError(res.data.message)
        }
      },
      fail: function (res) {
        //异常处理
        app.httpError(res.message)
      },
      urlname: api.GET_settings
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