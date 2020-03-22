const app = getApp()
Page({
	data: {
		
	},
	// 设置店铺
	goSetup() {
		wx.navigateTo({
			url: '/pages/setup/index'
		})
	}
});
