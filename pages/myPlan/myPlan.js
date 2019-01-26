// pages/myPlan/myPlan.js
const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const blue_Com = require('../../utils/bluetooth-command.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    daily_Num: 0,
    slider_Min: 0,
    slider_Max: 0,
    timeList: [], //闹钟集合
    deleteId_list: [], //删除的闹钟id集合
    modify_list:[], //修改的时间集合
    add_list: [], //新增的时间集合
    whetherBindCup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log();
    const that = this;
    if (options.drinkEnd){
      that.setData({
        slider_Min: drinkStart,
        slider_Max: drinkEnd,
      })
    }
    if (app.globalData.whetherBindCup){
      that.setData({
        whetherBindCup:true
      })
    }

    if (options.drink_water){
      that.setData({
        daily_Num: options.drink_water
      })
    }
    //获取水杯闹钟
    network.GET({
      params: {
        uid: app.globalData.uid,
        deviceNo: app.globalData.deviceNo
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('获取水杯闹钟')
          console.log(res.data.data)
          //公共方法
          that.allfun(res.data.data);
          console.log(res.data.data.alarms)
        } else {
          //异常处理
          app.httpError(res.data.message)
        }
      },
      fail: function (res) {
        //异常处理
        app.httpError(res.message)
      },
      urlname: api.GET_time
    })
  },

  //滑块事件
  sliderchange: function(e) {
    console.log('slider发生 change 事件，携带值为', e.detail.value)
    this.setData({
      daily_Num: e.detail.value
    })
  },

  //滑块数值
  sliderchanging: function(e) {  
    // this.setData({
    //   daily_Num: e.detail.value
    // })
  },

  //删除时间
  delete_id: function(e){
    const that = this;
    console.log('delete_id值为', e.currentTarget.dataset.id)
    for (let a = 0; a < that.data.timeList.length; a++){
      if (that.data.timeList[a].id == e.currentTarget.dataset.id){
        that.data.timeList.splice(a, 1); 
      }
    } 
    that.setData({
      deleteId_list: that.data.deleteId_list.concat(e.currentTarget.dataset.id)
    })
    console.log(that.data.timeList)
    network.POST({
      params: {
        alarms: [],
        //用户删除的闹钟id集合
        deletes: that.data.deleteId_list,
        deviceNo: app.globalData.deviceNo,
        drinkPlan: that.data.daily_Num,
        uid: app.globalData.uid,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('删除闹钟成功')
          wx.showToast({
            title: '删除闹钟成功',
            icon: `none`,
            duration: 2000
          })
          //获取水杯闹钟
          network.GET({
            params: {
              uid: app.globalData.uid,
              deviceNo: app.globalData.deviceNo
            },
            success: function (res) {
              if (res.data.code == 200) {
                console.log('获取水杯闹钟')
                console.log(res.data.data)
                //公共方法
                that.allfun(res.data.data);
              } else {
                //异常处理
                app.httpError(res.data.message)
              }
            },
            fail: function (res) {
              //异常处理
              app.httpError(res.message)
            },
            urlname: api.GET_time
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
      urlname: api.POST_Drink_Edit
    })
  },

  //时间开关
  switchchange: function(e) {
    const that = this;
    console.log('slider发生 change 事件，携带值为', e.detail.value)
    console.log('slider发生 change 事件，携带值为', e.currentTarget.dataset.id)
    console.log(that.data.timeList)
    for (let a = 0; a < that.data.timeList.length; a++) {
      if (that.data.timeList[a].id == e.currentTarget.dataset.id) {
        that.data.timeList[a].switching = e.detail.value;

        if (that.data.modify_list !== []){
          for (let i = 0; i < that.data.modify_list.length; i++){
            if (that.data.timeList[a].id == that.data.modify_list[i].id){
              return 
            }
          }   
          that.data.modify_list = that.data.modify_list.concat(that.data.timeList[a])
        } else {
          that.data.modify_list = that.data.modify_list.concat(that.data.timeList[a])
        }

      }
    } 
    console.log(that.data.modify_list)
  },


  //新增时间
  bindTimeChange(e) {
    const that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let timeList = that.data.timeList;
    if (timeList.length >= 10){
      wx.showToast({
        title: '闹钟不可超过10个',
        icon: `none`,
        duration: 2000
      })
      return
    }
    for (let i = 0; i < timeList.length; i++){
      if (timeList[i].date == e.detail.value){
        wx.showToast({
          title: '当前闹钟已经存在',
          icon: `none`,
          duration: 2000
        })
        return;
      }
    }
    let value = [{
      date: e.detail.value,
      id: '',
      switching: "OFF"
    }]
    console.log(value)

    network.POST({
      params: {
        //用户设置的闹钟集合 
        alarms: value,
        deletes: [],
        deviceNo: app.globalData.deviceNo,
        drinkPlan: that.data.daily_Num,
        uid: app.globalData.uid,
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '新增闹钟成功',
            icon: `none`,
            duration: 2000
          })

          var buffer2 = blue_Com.getPacket(blue_Com.command_data.WX.REMINDER_TIME, e.detail.value)
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

          //获取水杯闹钟
          network.GET({
            params: {
              uid: app.globalData.uid,
              deviceNo: app.globalData.deviceNo
            },
            success: function (res) {
              if (res.data.code == 200) {
                console.log('获取水杯闹钟')
                console.log(res.data.data)
                //公共方法
                that.allfun(res.data.data);
              } else {
                //异常处理
                app.httpError(res.data.message)
              }
            },
            fail: function (res) {
              //异常处理
              app.httpError(res.message)
            },
            urlname: api.GET_time
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
      urlname: api.POST_Drink_Edit
    })
  },

  //保存设置
  requestFun: function(){
    const that = this;
    if (that.data.modify_list !== []){
      for (let i = 0; i < that.data.modify_list.length; i++) {
        if (that.data.modify_list[i].switching == false) {
          that.data.modify_list[i].switching = 'ON';
        } else {
          that.data.modify_list[i].switching = 'OFF';
        }
      }
    }
    
    console.log(that.data.modify_list)
    //更新计划饮水量和设置闹钟
    network.POST({
      params: {
        //用户设置的闹钟集合 
        alarms: that.data.modify_list,
        deletes: [],
        deviceNo: app.globalData.deviceNo,
        drinkPlan: that.data.daily_Num,
        uid: app.globalData.uid,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('更新计划饮水量和设置闹钟')
          console.log(res.data.data)
          wx.showToast({
            title:'保存成功',
            icon: `none`,
            duration: 2000
          })
          app.globalData.drinkPlan = res.data.data.drinkPlan
        } else {
          //异常处理
          app.httpError(res.data.message)
        }
      },
      fail: function (res) {
        //异常处理
        app.httpError(res.message)
      },
      urlname: api.POST_Drink_Edit
    })

    // if (that.data.daily_Num !== app.globalData.drinkPlan && app.globalData.drinkPlan !== null){
    var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.PRESET_WATER, that.addPreZero(that.data.daily_Num).toString())
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
          console.log("发送预设喝水量");
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

  //
  allfun: function (listdata){
    const that = this;
    if (listdata.alarms){
      for (var i = 0; i < listdata.alarms.length; i++) {
        if (listdata.alarms[i].switching == "ON") {
          listdata.alarms[i].switching = false
        }
        if (listdata.alarms[i].switching == "OFF") {
          listdata.alarms[i].switching = true
        }
      }
      that.setData({
        timeList: listdata.alarms,
      })
    } else {
      that.setData({
        timeList: [],
      })
    }
    that.setData({
      slider_Min: listdata.drinkStart,
      slider_Max: listdata.drinkEnd
    })
    
  },

  addPreZero: function (num) {
    if (num < 10) {
      return '000' + num;
    } else if (num < 100) {
      return '00' + num;
    } else if (num < 1000) {
      return '0' + num;
    } else {
      return num;
    }
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