const app = getApp()
Page({
	data: {
		userInfo: null,
		isLogin: false,
		hasPhone: ''
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
		const {
			name
		} = e.currentTarget.dataset
		this.goLoginCall(() => {
			wx.navigateTo({
				url: `/pages/${name}/index`
			})
		})
	},
	goLoginCall(cb) {
		if (this.data.isLogin) {
			cb()
		} else {
			wx.navigateTo({
				url: '/pages/login/index'
			})
		}
	},
	goOrderList(e) {
		const {
			status
		} = e.currentTarget.dataset

		this.goLoginCall(() => {
			wx.navigateTo({
				url: `/pages/order/index?status=${status}`
			})
		})
	},
	async findUserInfo() {
		const res = await wx.utils.Http.get({
			url: '/myInfo/findUserInfo'
		})
		console.log('获取用户个人信息', res)
	},
	noOpen() {
		wx.utils.Toast('暂无开通')
	},
	async init() {
		wx.utils.showLoading()
		await wx.utils.Login.initUserInfo()
		this.setData({
			userInfo: wx.utils.Login.userInfo,
			isLogin: wx.utils.Login.isBind,
			phone: wx.utils.Login.phone
		})
		wx.utils.hideLoading()
	},
	async onShow() {
		await this.init()
	}
});
