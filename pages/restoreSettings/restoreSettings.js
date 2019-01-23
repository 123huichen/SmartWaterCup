const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const blue_Com = require('../../utils/bluetooth-command.js')
// pages/restoreSettings/restoreSettings.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cup_Numbering: '',
    cup_name: '',
    mycup_color: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const deviceNodata = options.deviceNo; 
    const bluetoothNamedata = options.bluetoothName;
    const cupiddata = options.cupid;
    const color = options.color;
    this.setData({
      cup_Numbering: deviceNodata,
      cup_name: bluetoothNamedata,
      mycup_color: color
    })

    //接收数据
    wx.onBLECharacteristicValueChange(function (res) {
      console.log('接收数据')
      console.log('characteristic value comed:', blue_Com.buf2hex(res.value))

      var buffer1 = res.value
      var dataView = new DataView(buffer1)
      var dataResult = []
      var operating_code
      console.log("dataView.byteLength", dataView.byteLength)
      for (let i = 0; i < dataView.byteLength; i++) {
        dataResult.push('0x' + dataView.getUint8(i).toString(16))
        if (i == 2) {
          operating_code = dataView.getUint8(i).toString(16);
          operating_code = operating_code.toUpperCase();
          console.log(operating_code);
        }
      }
      const result = dataResult
      console.log(result)

      var resData = blue_Com.buf2hex(res.value);
      console.log(blue_Com.hexCharCodeToStr(resData));

      if (operating_code == blue_Com.command_data.WC.RESTORE_FACTORY) {
        console.log('已恢复出厂设置')

        //水杯设置
        let stringleng = 0;
        
        const timeName = setInterval(function () {
          if (stringleng == 8) {
            clearInterval(timeName)
            wx.hideLoading({
              success: function () {
                console.log('隐藏 loading 提示框')
              }
            })
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
        }, 1000)

        network.POST({
          params: {
            deviceNo: app.globalData.deviceNo,
            uid: app.globalData.uid,
          },
          success: function (res) {
            if (res.data.code == 200) {
              console.log('恢复出厂设置')
              console.log(res.data.data)
              wx.removeStorage({
                key: app.globalData.deviceNo,
                success(res) {
                  console.log(res)
                }
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
          urlname: api.POST_recovery
        })
        wx.showToast({
          title: '已恢复出厂设置',
          icon: `none`,
          duration: 2000
        })
      }
    })
  },

  reply_Settings: function(){
    wx.showLoading({
      title: '正在恢复出厂设置...',
      mask: true
    })
    var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.RESTORE_FACTORY)
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
        console.log("恢复出厂设置");
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