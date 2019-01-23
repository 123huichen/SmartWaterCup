const network = require('utils/network.js')
const api = require('utils/api.js')
const md5 = require('utils/md5.js')
const blue_Com = require('utils/bluetooth-command.js')
//app.js


App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          let codedata = res.code;
          console.log('code值' + codedata);
          that.globalData.codedata = codedata;
        }
      }
    })

    // 获取用户信息
    wx.getSetting({     
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          //判断用户没有授权需要弹框
          that.globalData.authorize = true
        } else {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {  
              that.globalData.authorize = false
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    this.globalData.sysinfo = wx.getSystemInfoSync()

    //打开蓝牙适配器
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res, "success")
      },
      fail: function (res) {
        console.log(res)
        if (res.errCode == 10001){
          that.globalData.bluetootIfshow = false;
          wx.showToast({
            title: '请打开手机蓝牙',
            icon: `none`,
            duration: 2000
          })
        }
      },
    })


    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log('获取本机蓝牙适配器状态'+res)  
        console.log(res)
      }
    })

    wx.onBluetoothAdapterStateChange(function (res) {
      console.log(`adapterState changed, now is===========`, res)
      if (res.available && that.globalData.bluetootIfshow == false && that.globalData.deviceId){
        that.globalData.bluetootIfshow = true;
        that.bluetoot_Connection()
      }
    })
    

    //接收数据
    wx.onBLECharacteristicValueChange(function (res) {
      console.log('接收数据:', blue_Com.buf2hex(res.value))

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
      if (operating_code == blue_Com.command_data.WC.CONFIRM_PASSWORD) {
        that.globalData.positioning_reminder = true;

        // const currentTime = that.getNowFormatDate();
        // console.log(currentTime)
        // var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.INTERNET_TIME, currentTime) //发送互联网时间给水杯
        // console.log('buffer1--------------' + buffer1)
        // var typedArray = new Uint8Array(buffer1.match(/[\da-f]{2}/gi).map(function (h) {
        //   return parseInt(h, 16)
        // }))

        // var buffer = typedArray.buffer
        // console.log(buffer)

        // wx.writeBLECharacteristicValue({
        //   deviceId: that.globalData.deviceId,
        //   serviceId: that.globalData.serviceId,
        //   characteristicId: that.globalData.cd02,
        //   value: buffer,
        //   success: function (res) {
        //     console.log("success  设置密码成功");
        //     console.log(res);
        //   },
        //   fail: function (res) {
        //     console.log(res);
        //   },
        //   complete: function (res) {
        //     console.log(res);
        //   }
        // })
      }
      if (operating_code == blue_Com.command_data.WC.DEVICENO) { //链接蓝牙成功

        var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.CHANGE_PASSWORD, that.data.settingpassword_data)
        console.log('buffer1--------------' + buffer1)
        var typedArray = new Uint8Array(buffer1.match(/[\da-f]{2}/gi).map(function (h) {
          return parseInt(h, 16)
        }))

        var buffer = typedArray.buffer
        console.log(buffer)

        wx.writeBLECharacteristicValue({
          deviceId: that.globalData.deviceId,
          serviceId: that.globalData.serviceId,
          characteristicId: that.globalData.cd02,
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

      }
      if (operating_code == blue_Com.command_data.WC.SET_PASSWORD) {
        console.log('蓝牙链接成功')
        wx.showToast({
          title: '蓝牙已链接',
          icon: `none`,
          duration: 2000
        })
      }
      if (operating_code == blue_Com.command_data.WC.PASSWORD_INCORRECT) {
        wx.showToast({
          title: '密码错误',
          icon: `none`,
          duration: 2000
        })
      }
      if (operating_code == blue_Com.command_data.WC.COMING_SOON || operating_code == blue_Com.command_data.WC.MORE_THAN_90 || operating_code == blue_Com.command_data.WC.MORE_THAN_80 || operating_code == blue_Com.command_data.WC.DRY_BURNING || operating_code == blue_Com.command_data.WC.CLEANING || operating_code == blue_Com.command_data.WC.FREE_FALL){
        
        if (operating_code == blue_Com.command_data.WC.COMING_SOON){
          var datatype = 'NO_ELECTRICITY';
        }
        if (operating_code == blue_Com.command_data.WC.MORE_THAN_90) {
          var datatype = 'BOILING';
        }
        if (operating_code == blue_Com.command_data.WC.MORE_THAN_80) {
          var datatype = 'MORE_THAN_90';
        }
        if (operating_code == blue_Com.command_data.WC.DRY_BURNING) {
          var datatype = 'POUR_CUP';
        }
        if (operating_code == blue_Com.command_data.WC.CLEANING) {
          var datatype = 'CLEANING';
        }
        if (operating_code == blue_Com.command_data.WC.FREE_FALL) {
          var datatype = 'DROP';
        }

        var data_date = blue_Com.hexCharCodeToStr(resData)
        var myDate = new Date();
        myDate.getFullYear();
        var seperator1 = "-";
        var data_date01 = '';
        for (var e = 0; e < data_date.length; e = e+2){

          if (e == data_date.length-2){
            data_date01 = data_date01 + data_date[e] + data_date[e + 1]
          } else {
            data_date01 = data_date[e] + data_date[e + 1] + seperator1
          }
        }
        data_date01 = myDate.getFullYear() + seperator1 + data_date01;
        console.log(data_date01)

        network.POST({
          params: {
            cupDeviceNo: that.globalData.deviceNo,
            date: data_date01,
            type: datatype
          },
          success: function (res) {
            if (res.data.code == 200) {
              console.log('添加水杯记录')
              console.log(res.data.data)
            } else {
              //异常处理
              that.httpError(res.data.message)
            }
          },
          fail: function (res) {
            that.httpError(res.message)
          },
          urlname: api.POST_record
        })

      }
      if (operating_code == blue_Com.command_data.WC.BATTERY_INFORMATION) { //水杯发送电量信息给小程序
        that.globalData.electricity = Number(blue_Com.hexCharCodeToStr(resData))
        let pages = getCurrentPages();
        console.log(pages[0])
        if (pages[0].route == "pages/index/index"){
          console.log(pages[0].route)
          pages[0].setData({
            electricity: that.globalData.electricity + 1
          })
        }
      }
      if (operating_code == blue_Com.command_data.WC.NOW_TEMPERATURE) { //当前温度
        that.globalData.currentTemperature = blue_Com.hexCharCodeToStr(resData)
        let pages = getCurrentPages();
        console.log(pages[0])
        if (pages[0].route == "pages/healthIndex/healthIndex") {
          console.log(pages[0].route)
          pages[0].setData({
            temperature: parseInt(that.globalData.currentTemperature)
          })
        }
      }
      if (operating_code == blue_Com.command_data.WC.NOW_DRINKING_WATER) { //当前喝水量
        console.log('当前喝水量')
        that.globalData.currentDrink = blue_Com.hexCharCodeToStr(resData)
      }
      if (operating_code == blue_Com.command_data.WC.LOST_INFORMATION) { //水杯发送丢失信息给小程序
        console.log('水杯发送丢失信息给小程序')
      }
      if (operating_code == blue_Com.command_data.WC.SET_UP_TEMPERATURE) { //设定温度
        console.log('设定温度')
        network.POST({
          params: {
            deviceNo: that.globalData.deviceNo,
            uid: that.globalData.uid,
            type: that.globalData.boiling_water_type
          },
          success: function (res) {
            if (res.data.code == 200) {
              console.log('保存烧水记录')
              console.log(res.data.data)
            } else {
              //异常处理
              that.httpError(res.data.message)
            }
          },
          fail: function (res) {
            that.httpError(res.message)
          },
          urlname: api.POST_history
        })
      }


      if (that.globalData.monitoring_management == false && that.globalData.electricity && that.globalData.currentTemperature && that.globalData.currentDrink){
        network.POST({
          params: {
            deviceNo: that.globalData.deviceNo,
            connectionStatus: 'UNCONNECTED', //已连接：CONNECTED，未连接：UNCONNECTED)
            currentDrink: that.globalData.currentDrink, //当前喝水量
            currentTemperature: that.globalData.currentTemperature, //当前温度
            electricity: that.globalData.electricity, //水杯电量
          },
          success: function (res) {
            if (res.data.code == 200) {
              console.log('水杯状态更新')
              console.log(res.data.data)

            } else {
              that.httpError(res.data.message)
            }
          },
          fail: function (res) {
            that.httpError(res.message)
          },
          urlname: api.POST_monitor
        })

        that.globalData.monitoring_management = true
      }

    })

    //蓝牙断开
    wx.onBLEConnectionStateChange(function (res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
      if (res.connected == false){
        console.log('蓝牙已经断开')
        wx.getLocation({
          type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
          success(res) {
            const latitude = res.latitude
            const longitude = res.longitude

            network.POST({
              params: {
                cupDeviceNo: that.globalData.deviceNo,
                latitude: latitude,
                longitude: longitude
              },
              success: function (res) {
                if (res.data.code == 200) {
                  console.log('添加水杯离线记录')
                  console.log(res.data.data)
                } else {
                  app.httpError(res.data.message)
                }
              },
              fail: function (res) {
                app.httpError(res.message)
              },
              urlname: api.POST_offline
            })
          },
          fail(res) {
            console.log(res)
          }
        })

        if (that.globalData.electricity && that.globalData.currentTemperature && that.globalData.currentDrink) {
          network.POST({
            params: {
              deviceNo: that.globalData.deviceNo,
              connectionStatus: 'UNCONNECTED', //已连接：CONNECTED，未连接：UNCONNECTED)
              currentDrink: that.globalData.currentDrink, //当前喝水量
              currentTemperature: that.globalData.currentTemperature, //当前温度
              electricity: that.globalData.electricity, //水杯电量
            },
            success: function (res) {
              if (res.data.code == 200) {
                console.log('水杯断开状态更新')
                console.log(res.data.data)

              } else {
                //异常处理
                that.httpError(res.data.message)
              }
            },
            fail: function (res) {
              //异常处理
              that.httpError(res.message)
            },
            urlname: api.POST_monitor
          })
        }
      }
    })


  },

  getModel: function () { //获取手机型号
    return this.globalData.sysinfo["model"]
  },
  getVersion: function () { //获取微信版本号
    return this.globalData.sysinfo["version"]
  },
  getSystem: function () { //获取操作系统版本
    return this.globalData.sysinfo["system"]
  },
  getPlatform: function () { //获取客户端平台
    return this.globalData.sysinfo["platform"]
  },
  getSDKVersion: function () { //获取客户端基础库版本
    return this.globalData.sysinfo["SDKVersion"]
  },

  getNowFormatDate: function () {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + month + strDate + date.getHours() + date.getMinutes() + date.getSeconds();
    return currentdate;
  },

  //错误处理
  httpError: function (status) {
    wx.showToast({
      title: status, 
      icon: `none`,
      duration: 2000
    })
  },

  //登录授权
  getOP: function (e) {
    const that = this
    const timestamp = new Date().getTime();
    //const secretKey = md5.md5(timestamp + 'GZXANT' + that.globalData.codedata)
    const secretKey = timestamp + 'GZXANT' + that.globalData.codedata
    wx.request({
      url: api.API_URL + api.POST_authorization,
      data: {
        code: that.globalData.codedata,
        currentTime: timestamp,
        nickname: e.nickName,
        secretKey: secretKey,
        url: e.avatarUrl,
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          console.log('uid' + res.data.data.uid)
          that.globalData.uid = res.data.data.uid;
          if (!res.data.data.identification) {
            //用户资料不完善
            wx.navigateTo({
              url: '../dataCard/dataCard'
            })
          }
          var myDate = new Date();
          myDate.getFullYear();
          console.log(myDate.getFullYear())

          //获取我的水杯
          network.GET({
            params: {
              uid: that.globalData.uid
            },
            success: function (res) {
              if (res.data.code == 200) {
                console.log('获取我的水杯')
                console.log(res.data.data);
                if (res.data.data){
                  that.globalData.whetherBindCup = true
                  that.globalData.bluetoothName = res.data.data[0].bluetoothName
                  that.globalData.deviceId = res.data.data[0].advertisServiceUUIDs
                  that.globalData.deviceNo = res.data.data[0].deviceNo
                  for (var i = 0; i < res.data.data.length; i++) {
                    console.log(res.data.data[0].deviceNo)
                    that.globalData.deviceNo = res.data.data[0].deviceNo
                    wx.getStorage({
                      key: res.data.data[0].deviceNo,
                      success(res) {
                        console.log('获取缓存------' + res.data)

                        if (res.data){
                          that.globalData.password = res.data; //密码
                          
                          that.bluetoot_Connection() //蓝牙连接
                        } 
                      },
                      fail(res){
                        console.log(res.errMsg)
                        console.log('缓存为空， 水杯校验')
                        if (res.errMsg == "getStorage:fail:data not found" || res.errMsg == "getStorage:fail data not found"){
                          console.log('缓存为空， 水杯校验')
                          network.GET({
                            params: {
                              deviceNo: that.globalData.deviceNo,
                              uid: that.globalData.uid,
                            },
                            success: function (res) {
                              if (res.data.code == 200) {
                                console.log(res.data.data);
                                if (res.data.data.verifyStatus == "Present") {
                                  wx.navigateTo({
                                    url: `../createBluetooth/createBluetooth?verifyStatus=${res.data.data.verifyStatus}&localName=${that.globalData.bluetoothName}&deviceId=${that.globalData.deviceId}&cupDeviceNo=${that.globalData.deviceId}`
                                  })
                                } else {
                                  wx.navigateTo({
                                    url: `../createBluetooth/createBluetooth?verifyStatus=${res.data.data.verifyStatus}&localName=${that.globalData.bluetoothName}&deviceId=${that.globalData.deviceId}&cupDeviceNo=${that.globalData.deviceId}`
                                  })
                                }
                              } else {
                                that.httpError(res.data.message)
                              }
                            },
                            fail: function (res) {
                              that.httpError(res.message)
                            },
                            urlname: api.POST_validate
                          })
                        }
                      }
                    })

                  }
                }
                
              } else {
                that.httpError(res.data.message)
              }
            },
            fail: function (res) {
              that.httpError(res.message)
            },
            urlname: api.GET_get
          })

        } else {
          that.httpError(res.data.message)
        }
      },
      fail: function (res) {
        that.httpError(res.message)
      }
    })
    
  },

  //蓝牙连接
  bluetoot_Connection: function(){
    const that = this;
    wx.createBLEConnection({ //链接已链接过的蓝牙设备
      deviceId: that.globalData.deviceId,
      success: function (res) {
        console.log(res)// success

        /**
         * 连接成功，后开始获取设备的服务列表
         */
        wx.getBLEDeviceServices({
          deviceId: that.globalData.deviceId,
          success: function (res) {
            console.log('device services:', res.services)
            that.globalData.services = res.services
            console.log('device serviceId:', that.globalData.services[0].uuid);
            that.globalData.serviceId = that.globalData.services[0].uuid
            console.log('--------------------------------------');
            console.log('device设备的服务id:', that.globalData.serviceId);

            /**
             * 延迟3秒，根据服务获取特征 
             */
            setTimeout(function () {
              wx.getBLEDeviceCharacteristics({
                deviceId: that.globalData.deviceId,// 这里的 deviceId 需要在上面的 getBluetoothDevices
                serviceId: that.globalData.serviceId,// 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
                success: function (res) {
                  console.log('------------' + that.globalData.serviceId);
                  console.log('device getBLEDeviceCharacteristics:', res.characteristics);

                  that.globalData.cd01 = res.characteristics[0].uuid //读
                  that.globalData.cd02 = res.characteristics[1].uuid //写
                  that.globalData.cd03 = res.characteristics[2].uuid //读
                  that.globalData.characteristics01 = res.characteristics[2]


                  /**
                   * 顺序开发设备特征notifiy
                   */
                  wx.notifyBLECharacteristicValueChanged({
                    deviceId: that.globalData.deviceId,
                    serviceId: that.globalData.serviceId,
                    characteristicId: that.globalData.cd01,
                    state: true,
                    success: function (res) {
                      console.log('顺序开发设备特征notifiy success', res);
                    },
                    fail: function (res) {
                      console.log('顺序开发设备特征notifiy----' + that.globalData.cd01);
                      console.log('顺序开发设备特征notifiy fail', res);
                    }
                  })

                  /**
                   * 顺序开发设备特征notifiy
                   */
                  wx.notifyBLECharacteristicValueChanged({
                    deviceId: that.globalData.deviceId,
                    serviceId: that.globalData.serviceId,
                    characteristicId: that.globalData.cd03,
                    state: true,
                    success: function (res) {
                      console.log('顺序开发设备特征notifiy success', res);
                    },
                    fail: function (res) {
                      console.log('顺序开发设备特征notifiy---' + that.globalData.cd03);
                      console.log('顺序开发设备特征notifiy fail', res);
                    }
                  })

                  //发送 密码到设备中
                  var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.SET_PASSWORD, that.globalData.password)
                  console.log('buffer1--------------' + buffer1)
                  var typedArray = new Uint8Array(buffer1.match(/[\da-f]{2}/gi).map(function (h) {
                    return parseInt(h, 16)
                  }))

                  var buffer = typedArray.buffer
                  console.log(buffer)

                  wx.writeBLECharacteristicValue({
                    deviceId: that.globalData.deviceId,
                    serviceId: that.globalData.serviceId,
                    characteristicId: that.globalData.cd02,
                    value: buffer,
                    success: function (res) {
                      console.log("success  发送密码成功");
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
                fail: function (res) {
                  console.log(res);
                }
              })
            }, 1500)
          }
        })
      }
    })
  },
  

  globalData: {
    userInfo: null, 
    authorize: null, //用户授权弹窗
    codedata: null, 
    uid: null, //用户id
    drinkPlan: null, //每日计划饮水量
    deviceNo: null, //水杯设备号
    bluetoothName: null,
    sysinfo: null, //获取设备信息
    boiling_water_type: null, //烧水类型


    //蓝牙全局变量
    deviceId: null,
    serviceId: null,
    services: null,
    cd01: null,
    cd02: null,
    cd03: null,
    characteristics01: null,
    characteristics02: null,
    characteristics03: null,


    bluetootIfshow: true, //蓝牙是否开启
    whetherBindCup: null, 
    password: null, //全局密码

    monitoring_management: false,
    electricity: 0, //蓝牙电量
    currentTemperature: 0, //
    currentDrink: 0, //  


    positioning_reminder: false
  }
})