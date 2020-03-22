const app = getApp()
Page({
	data: {
		shopInfo: '',
	},
	goPage(e) {
		wx.utils.goPage(e)
	},
	async findUserInfo() {
		const res = await wx.utils.Http.get({
			url: '/myInfo/findUserInfo'
		})
	},
	async getShopInfo() {
		const res = await wx.utils.Http.get({
			url: '/merShop/findSaleMer'
		})
		if (res.code == 0) {
			this.setData({
				shopInfo: res.data
			})
		}
	},
	onLoad() {
		this.getShopInfo()
	}
});
