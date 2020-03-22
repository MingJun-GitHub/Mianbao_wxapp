const app = getApp()
Page({
	data: {
		userInfo: null,
		isLogin: false,
		hasPhone: '',
		shopInfo: '',
		merStatus: 0, // '0待申请,1待审批,2审批通过,3审批拒绝
	},
	goLogin() {
		if (this.data.isLogin) {
			return
		}
		wx.navigateTo({
			url: '/pages/login/index'
		})
	},
	goBindPhone() {
		wx.navigateTo({
			url: '/pages/login/index?opt=phone'
		})
	},
	goMyOrder() {
		this.goLoginCall(() => {
			wx.navigateTo({
				url: '/pages/myOrder/index'
			})
		})
	},
	goPage(e) {
		wx.utils.goPage(e)
	},
	async findUserInfo() {
		const res = await wx.utils.Http.get({
			url: '/myInfo/findUserInfo'
		})
		console.log('获取用户个人信息', res)
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
	async applyShop() {
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/myInfo/getShop'
		})
		onsole.log('申请店铺--->', res)
		wx.utils.hideLoading()
		if (res.code == 0) {
			wx.utils.Toast('申请成功，等待系统审核成功')
			await this.getShopInfo()
		} else {
			wx.utils.Toast(res.data || '操作失败，请重试')
		}
		console.log('申请店铺--->', res)
	},
	async init() {
		wx.utils.showLoading()
		await wx.utils.Login.initUserInfo()
		this.setData({
			userInfo: wx.utils.Login.userInfo,
			isLogin: wx.utils.Login.isBind,
			phone: wx.utils.Login.phone,
			merStatus: wx.utils.Login.userInfo.merStatus
		})
		wx.utils.hideLoading()
	},
	async onShow() {
		await this.init()
		await this.getShopInfo()
	}
});
