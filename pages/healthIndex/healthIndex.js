const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
import wxCharts from '../../utils/wxcharts-min.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    number_H:'0',
    drink_water: '0',
    aims_water: '0',
    temperature: 0,
    If_UserInfo: false,
    currentDrinklist: '',
    timelist: '',
    centernum: '',
    canvasWidth: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const that = this;
    if (app.globalData.userInfo) {
      that.setData({
        If_UserInfo: true,
      })

      var query = wx.createSelectorQuery();
      //选择id
      query.select('.progress_box').boundingClientRect(function (rect) {
        console.log(rect.width)
        that.setData({
          centernum: rect.width / 2
        })
      }).exec();
    }
    
  },

  myPlan: function() {
    wx.navigateTo({
      url: '../myPlan/myPlan?drink_water=' + this.data.drink_water
    })
  },

  drinkingHistory: function () {
    wx.navigateTo({
      url: '../drinkingHistory/drinking_History'
    })
  },

  //画圆环
  drawCircle: function (step) {
    const that = this;
    console.log('是否加载2----------')
    var context = wx.createCanvasContext('canvasProgress');

    context.setLineWidth(6);
    context.setStrokeStyle('#63BDFF');
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(that.data.centernum, that.data.centernum, that.data.centernum - 3, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  //获取当前时间
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    var currentDrinklist = [];//获取currentDrink的值
    var timelist = [];//获取时间数组
    var currentDrinklistMax = '';
    var currentDrinklistMin = '';
    console.log('app.globalData.drinkPlan' + app.globalData.drinkPlan)
    if (app.globalData.drinkPlan !== null){
      that.setData({
        drink_water: app.globalData.drinkPlan,
      })
    }

    if (app.globalData.userInfo) {
      that.setData({
        If_UserInfo: true,
      })
      const date = that.getNowFormatDate()
      console.log('date'+date);
      if (that.data.currentDrinklist.length == 0 && that.data.timelist.length == 0 ){
        //健康生活管理
        network.GET({
          params: {
            uid: app.globalData.uid,
            deviceNo: app.globalData.deviceNo,
            date: date
          },
          success: function (res) {
            if (res.data.code == 200) {
              console.log('健康生活管理')
              console.log(res.data.data)

              const drinks = res.data.data.drinks;
              console.log('drinks' + drinks)

              for (let i = 0; i < drinks.length; i++) {
                currentDrinklist = currentDrinklist.concat(drinks[i].currentDrink);
                timelist = timelist.concat(drinks[i].date);
                //获取currentDrinklist里的最大值和最小值
                if(i==0){
                  currentDrinklistMax = drinks[i].currentDrink;
                  currentDrinklistMin = drinks[i].currentDrink;
                } else {
                  currentDrinklistMax = Math.max(currentDrinklistMax, drinks[i].currentDrink);
                  currentDrinklistMin = Math.min(currentDrinklistMax, drinks[i].currentDrink);

                }
              }
              if (currentDrinklistMax == 0) {
                currentDrinklistMax = 100;
              }
              console.log('currentDrinklistMax-------------' + currentDrinklistMax);
              console.log('currentDrinklistMin-------------' + currentDrinklistMin);
              console.log(currentDrinklist);
              console.log(timelist)

              that.setData({
                number_H: res.data.data.completePlan,
                aims_water: res.data.data.currentDrink,
                drink_water: res.data.data.drinkPlan,
                currentDrinklist: currentDrinklist,
                timelist: timelist,
                canvasWidth: (res.data.data.completePlan * 2) / 100
              })

              that.drawCircle(that.data.canvasWidth)

              let windowWidth = 320;
              try {
                let res = wx.getSystemInfoSync();
                windowWidth = res.windowWidth;
              } catch (e) {
                // do something when get system info failed
              }
              let chart = new wxCharts({
                canvasId: 'pieCanvas',
                type: 'line',
                categories: that.data.timelist,//['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7'],
                animation: true,
                legend: false,
                dataLabel: false,
                dataPointShare: false,
                xAxis: [
                  {
                    gridColor: '#ccc',
                    fontColor: '#000',
                    disableGrid: true,
                    type: 'calibration'
                  }
                ],
                yAxis: [
                  {
                    disabled: true
                  }
                ],
                series: [
                  {
                    name: '成交量1',
                    data: that.data.currentDrinklist,//[1700, 1700, 1800, 1600, 1900, 1300, 1500],
                    format: function (val, name) {
                      return val.toFixed(2) + '万';
                    }
                  },
                ],
                xAxis: {
                  disableGrid: true
                },
                yAxis: {      //y轴数据
                  title: '',  //标题
                  format: function (val) {  //返回数值
                    return val.toFixed(2);
                  },
                  min: currentDrinklistMin,   //最小值
                  max: currentDrinklistMax + 200,   //最大值
                  gridColor: '#D8D8D8',
                },
                width: windowWidth,
                height: 240,
                dataLabel: false,
                dataPointShape: true,
                extra: {
                  lineStyle: 'curve'
                }
              })
            } else {
              //异常处理
              app.httpError(res.data.message)
            }

            //that.drawCircle(1) 
          },
          fail: function (res) {
            app.httpError(res.message)
          },
          urlname: api.GET_health_life
        })
      }
      
    }  

    that.drawCircle(that.data.canvasWidth)
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