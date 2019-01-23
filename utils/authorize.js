//获取用户信息新接口
function agreeGetUser(e) {
  //设置用户信息本地存储
  try {
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') { //用户授权失败
      wx.showToast({
        title: '用户授权失败，请重新授权登录',
        icon: 'none',
        duration: 1500,
      })
      return;
    } else {
      wx.setStorageSync('userInfo', e.detail)
    }

  } catch (e) {
    wx.showToast({
      title: '系统提示:网络错误',
      icon: 'none',
      duration: 1500,
    })
  }
  // wx.showLoading({
  //   title: '加载中...'
  // })
  console.log(e)
  //that.getOP(e.detail)
}

module.exports = {
  agreeGetUser: agreeGetUser,
}