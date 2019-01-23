// pages/calendar/calendar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
  },

  //给点击的日期设置一个背景颜色
  dayClick: function (event) {
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "#84e7d0"
    })

  },

  //时间选择
  dayClick: function (event) { 
    console.log(event.detail);

    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();

    if (event.detail.year > year){
      wx.showToast({
        title: '请勿大于当前时间',
        icon: `none`,
        duration: 2000
      })
      return;
    } else if (event.detail.year == year && event.detail.month > month){
      wx.showToast({
        title: '请勿大于当前时间',
        icon: `none`,
        duration: 2000
      })
      return;
    } else if (event.detail.year == year && event.detail.month == month && event.detail.day > strDate) {
      wx.showToast({
        title: '请勿大于当前时间',
        icon: `none`,
        duration: 2000
      })
      return;
    } else{
      var currentdate = event.detail.year + seperator1 + event.detail.month + seperator1 + event.detail.day;
      console.log(currentdate);
      wx.redirectTo({
        url: `../drinkingHistory/drinking_History?currentdate=${currentdate}`
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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