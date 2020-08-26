// pages/user/user.js
Page({
  data: {
    userinfo:{}
  },
  onShow() {
    const userinfo = wx.getStorageSync("userInfo");
    this.setData({userinfo})
  }
})