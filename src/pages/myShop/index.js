const app = getApp()
Page({
	data: {
		shopInfo: '',
		show: false
	},
	goPage(e) {
		wx.utils.goPage(e)
	},
	async findUserInfo() {
		const res = await wx.utils.Http.get({
			url: '/myInfo/findUserInfo'
		})
	},
	getShopInfo(e) {
		const {
			saleMer,
			// vistCount
		} = e.detail
		this.setData({
			 shopInfo: saleMer
		})
	},
	onLoad() {
		// this.getShopInfo()
	}
});
