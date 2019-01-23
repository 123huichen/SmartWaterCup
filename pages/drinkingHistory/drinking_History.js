const app = getApp();
const network = require('../../utils/network.js')
const api = require('../../utils/api.js')
import wxCharts from '../../utils/wxcharts-min.js'

var lineChart = null;
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    chart_title: '',
    currentDrinklist: '',
    timelist: '',
    completePlan: '', //完成计划
    currentDrink: '', //当日饮水
    boilingWater: '',
    coffee: '',
    custom: '',
    tea: '',
    boilingWaterwidth: '',
    coffeewidth: '',
    customwidth: '',
    teawidth: '',
    canvarWidth: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const that = this;
    var date = '';
    if (options.currentdate){
      date = options.currentdate;
    } else {
      date = that.getNowFormatDate()
    }
    var currentDrinklist = [];//获取currentDrink的值
    var timelist = [];//获取时间数组
    var currentDrinklistMax = '';
    var currentDrinklistMin = '';
    var titleTimemax = '';
    var titleTimemin = '';
    

    //历史详情管理
    network.GET({
      params: {
        uid: app.globalData.uid,
        deviceNo: app.globalData.deviceNo,
        date: date
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log('历史详情管理')
          console.log(res.data.data)

          const drinks = res.data.data.drinks;
          console.log('drinks' + drinks)
          titleTimemax = drinks[drinks.length - 1].date; 
          titleTimemin = drinks[0].date;
          for (let i = 0; i < drinks.length; i++) {
            currentDrinklist = currentDrinklist.concat(drinks[i].currentDrink);
            timelist = timelist.concat(drinks[i].date);
            
            //获取currentDrinklist里的最大值和最小值
            if (i == 0) {
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
          console.log('titleTimemax-------' + titleTimemax.replace(/-/g, "/"))
          console.log('titleTimemin-------' + titleTimemin.replace(/-/g, "/"))

          that.setData({
            currentDrinklist: currentDrinklist,
            timelist: timelist,
            completePlan: res.data.data.completePlan,
            currentDrink: res.data.data.currentDrink,
            boilingWater: res.data.data.drinkHabit.boilingWater,
            coffee: res.data.data.drinkHabit.coffee,
            custom: res.data.data.drinkHabit.custom,
            tea: res.data.data.drinkHabit.tea,
            boilingWaterwidth: res.data.data.drinkHabit.boilingWater * 4.24,
            coffeewidth: res.data.data.drinkHabit.coffee * 4.24,
            customwidth: res.data.data.drinkHabit.custom * 4.24,
            teawidth: res.data.data.drinkHabit.tea * 4.24,
            chart_title: titleTimemin.replace(/-/g, "/") + " - " + titleTimemax.replace(/-/g, "/"),
            canvarWidth: (res.data.data.completePlan * 2)/100
          })

          that.drawCircle(that.data.canvarWidth)

          let windowWidth = 320;
          try {
            let res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            // do something when get system info failed
          }
          lineChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: that.data.timelist,//['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7'],
            animation: true,
            legend: false,
            dataLabel: false,
            dataPointShare: true,
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
                name: '饮水量',
                data:  that.data.currentDrinklist,//[1700, 1700, 1800, 1600, 1900, 1300, 1500],
                  format: function (val, name) {
                  return val.toFixed(2) + 'ml';
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
          });
          
        } else {
          //异常处理
          app.httpError(res.data.message)
        }
      },
      fail: function (res) {
        //异常处理
        app.httpError(res.message)
      },
      urlname: api.GET_detail
    })
  },

  drawCircle: function (step) {
    const that = this;
    console.log('是否加载2----------')
    var context = wx.createCanvasContext('canvasProgress');

    context.setLineWidth(7);
    context.setStrokeStyle('#FFFFFF');
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(20, 20, 16.5, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },

  touchHandler: function (e) {
    const that = this
    //console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        
        network.GET({
          params: {
            uid: app.globalData.uid,
            deviceNo: app.globalData.deviceNo,
            date: category
          },
          success: function (res) {
            if (res.data.code == 200) {
              console.log('历史详情管理')
              console.log(res.data.data)
              that.setData({
                completePlan: res.data.data.completePlan,
                currentDrink: res.data.data.currentDrink,
                boilingWater: res.data.data.drinkHabit.boilingWater,
                coffee: res.data.data.drinkHabit.coffee,
                custom: res.data.data.drinkHabit.custom,
                tea: res.data.data.drinkHabit.tea,
                boilingWaterwidth: res.data.data.drinkHabit.boilingWater * 4.24,
                coffeewidth: res.data.data.drinkHabit.coffee * 4.24,
                customwidth: res.data.data.drinkHabit.custom * 4.24,
                teawidth: res.data.data.drinkHabit.tea * 4.24,
                canvarWidth: (res.data.data.completePlan * 2) / 100
              })

              that.drawCircle(that.data.canvarWidth)
            } else {
              //异常处理
              app.httpError(res.data.message)
            }
          },
          fail: function (res) {
            //异常处理
            app.httpError(res.message)
          },
          urlname: api.GET_detail
        })

       return category + ' ' + item.name + ':' + item.data;
      }
    });
  }, 

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

  //跳转到日历页面
  calendarpage: function() {
    wx.redirectTo({
      url: '../calendar/calendar'
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