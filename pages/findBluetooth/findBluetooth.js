// pages/findBluetooth/findBluetooth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    souso: true,
    Bluetoothshow:false,
    Bluetooth_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // ArrayBuffer转16进度字符串示例
  ab2hex: function (buffer) {
    const hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
  return hexArr.join('')
  },

  startBluetoothDevicesDiscovery: function(){
    var that = this;
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success(res) {
        console.log(res)
      }
    })

    wx.onBluetoothDeviceFound(function (devices) {
      console.log(devices.devices)
      console.log(that.data.Bluetooth_list)
      that.setData({
        souso: false,
        Bluetoothshow: true,
        Bluetooth_list: that.data.Bluetooth_list.concat(devices.devices)
      })
      console.log(that.data.Bluetooth_list)
      //console.log(this.ab2hex(devices[0].advertisData))

      // var isnotExist = true
      // if (devices.deviceId) {
      //   for (var i = 0; i < foundDevice.length; i++) {
      //     if (devices.deviceId == foundDevice[i].deviceId) {
      //       isnotExist = false
      //     }
      //   }
      //   if (isnotexist)
      //     foundDevice.push(devices)
      // }
      // else if (devices.devices) {
      //   for (var i = 0; i < foundDevice.length; i++) {
      //     if (devices.devices[0].deviceId == foundDevice[i].deviceId) {
      //       isnotExist = false
      //     }
      //   }
      //   if (isnotexist)
      //     foundDevice.push(devices.devices[0])
      // }
      // else if (devices[0]) {
      //   for (var i = 0; i < foundDevice.length; i++) {
      //     if (devices[0].deviceId == foundDevice[i].deviceId) {
      //       isnotExist = false
      //     }
      //   }
      //   if (isnotexist)
      //     foundDevice.push(devices[0])
      // }
    })
  },

  //链接蓝牙
  bluetooth_Lianjie: function(e){
    console.log(e.currentTarget.dataset.deviceid);
    console.log(e.currentTarget.dataset.localname);
    console.log(e.currentTarget.dataset.cupdeviceno);
    let deviceId = e.currentTarget.dataset.deviceid; 
    let localName = e.currentTarget.dataset.localname;
    let cupDeviceNo = e.currentTarget.dataset.deviceid;
    wx.navigateTo({
      url: `../createBluetooth/createBluetooth?deviceId=${deviceId}&localName=${localName}&cupDeviceNo=${cupDeviceNo}`
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