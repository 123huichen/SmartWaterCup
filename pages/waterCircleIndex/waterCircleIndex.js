const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
const blue_Com = require('../../utils/bluetooth-command.js')
// pages/waterCircleIndex/waterCircleIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendnum: 0, //水友数
    xiao_Xinum: 0,
    ranking: 0, //今日排名
    carryOut: 0, //完成度
    Ranking_list: '', //获取好友圈排行
    myname: '', 
    avatar: '',
    xiaoxinumdata: '',
    If_UserInfo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //我的水友
  water_Friend:function(){
    wx.navigateTo({
      url: '../waterFriend/waterFriend'
    })
  },

  //好友申请
  friend_Requests: function () {
    let str = JSON.stringify(this.data.xiaoxinumdata);
    wx.navigateTo({
      url: '../friend_Requests/friend_Requests?DataList=' + str,
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
    if (app.globalData.userInfo) {
      that.setData({
        If_UserInfo: true,
        avatar: app.globalData.userInfo.avatarUrl,
        myname: app.globalData.userInfo.nickName,
      })

      //获取添加消息列表
      network.GET({
        params: {
          uid: app.globalData.uid,
        },
        success: function (res) {
          if (res.data.code == 200) {
            console.log('获取添加消息列表')
            console.log(res.data.data)
            that.data.xiaoxinumdata = res.data.data;
            var xiaoxinumlength = '';
            if (!res.data.data) {
              xiaoxinumlength = 0;
            } else {
              xiaoxinumlength = res.data.data.length;
            }
            that.setData({
              xiao_Xinum: xiaoxinumlength,
            })
          } else {
            //异常处理
            app.httpError(res.data.message)
          }
        },
        fail: function (res) {
          app.httpError(res.message)
        },
        urlname: api.GET_list
      })

      //获取好友数量
      network.GET({
        params: {
          uid: app.globalData.uid,
        },
        success: function (res) {
          if (res.data.code == 200) {
            console.log('获取好友数量')
            console.log(res)
            if (!res.data.data) {
              var friendnumData = 0
            } else {
              var friendnumData = res.data.data
            }
            that.setData({
              friendnum: friendnumData
            })
          } else {
            //异常处理
            app.httpError(res.data.message)
          }
        },
        fail: function (res) {
          app.httpError(res.message)
        },
        urlname: api.GET_Friend_Number
      })

      //获取好友圈排行
      network.GET({
        params: {
          uid: app.globalData.uid,
        },
        success: function (res) {
          if (res.data.code == 200) {
            console.log('获取好友圈排行')
            console.log(res.data.data)

            if (res.data.data){
              for (var i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].uid == app.globalData.uid) {
                  that.setData({
                    carryOut: res.data.data[i].completePlan,
                    ranking: i + 1
                  })
                }
              }
              that.setData({
                Ranking_list: res.data.data
              })
            }
            
          } else {
            //异常处理
            app.httpError(res.data.message)
          }
        },
        fail: function (res) {
          app.httpError(res.message)
        },
        urlname: api.GET_Friend_Ranking_list
      })
    }
    
  },



  //提醒
  Remind_But: function(e) {
    const that = this;
    const friendUid = e.target.dataset.friendUid;
    const formId = e.detail.formId;

    wx.request({
      url: api.API_URL + api.POST_remind,
      data: {
        id: app.globalData.uid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          console.log('保存好友被提醒数据')
          console.log(res.data.data)

          if (res.data.data == null){
            //微信消息推送管理
            network.GET({
              params: {
                formId: formId,
                friendUid: friendUid,
                uid: app.globalData.uid,
              },
              success: function (res) {
                if (res.data.code == 200) {
                  console.log('微信消息推送管理')
                  console.log(res.data.data)
                  wx.showToast({
                    title: '提醒成功',
                    icon: `none`,
                    duration: 2000
                  })
                } else {
                  //异常处理
                  app.httpError(res.data.message)
                }
              },
              fail: function (res) {
                app.httpError(res.message)
              },
              urlname: api.GET_Feedback_List
            })

            var buffer1 = blue_Com.getPacket(blue_Com.command_data.WX.CUOYICUO)
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
                console.log("小程序发送喝水“搓一搓”提醒给水杯");
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


        } else {
          app.httpError(res.data.message)
        }
      },
      fail: function (res) {
        app.httpError(res.message)
      }
    })

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