const app = getApp()
Page({
	data: {
		saleMer: '',
		vistCount: ''
	},
	getShopInfo(e) {
		const {
			saleMer,
			vistCount
		} = e.detail
		this.setData({
			saleMer,
			vistCount
		})
	},
	// 设置店铺
	goSetup() {
		wx.navigateTo({
			url: '/pages/setup/index'
		})
	},
	setAmout(e) {
		const {
			value
		} = e.detail
		this.setData({
			['saleMer.redBagAmount']: value
		})
	},
	async saveRedGagAmout() {
		if (!this.data.saleMer.redBagAmount) {
			wx.utils.Toast('请输入店铺红包金额')
			return
		} else {
			wx.utils.showLoading()
			const res = await wx.utils.Http.post({
				url: '/merShop/setShopRedBag',
				data: {
					redBagAmount: this.data.saleMer.redBagAmount
				}
			})
			wx.utils.hideLoading()
			if (res.code == 0) {
				wx.utils.Toast('红包设置成功')
				setTimeout(() => {
					wx.navigateBack()
				}, 1500)
			} else {
				wx.utils.Toast('设置失败，请重新设置')

			}
		}
	}
});
