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
			saleMer
		} = e.detail
		this.setData({
			shopInfo: saleMer
		})
	},
	async goShopCode() {
		wx.utils.shopInfo = this.data.shopInfo
		wx.navigateTo({
			url: `/pages/shopCode/index`
		})
	},
	onLoad() {
		// this.getShopInfo()
	}
});
