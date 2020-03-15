const app = getApp()
Page({
	data: {
		disabled: false,
		userInfo: null,
		isLogin: false,
		phone: null
	},
	// 走登录流程
	bindPhone(e) {
		if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
			return
		} else {
			this.bindUserInfo(e)
		}
	},
	async bindUserInfo(e) {
		const {
			city,
			nickName,
			province,
			country,
			avatarUrl
		} = e.detail.userInfo
		wx.utils.showLoading()
		const res = await wx.utils.Http.post({
			url: '/wxUser/updateUserInfo',
			data: {
				city,
				country,
				nickName,
				openId: '',
				phone: '',
				province,
				realName: '',
				sessionKey: wx.getStorageSync('loginInfo').sessionKey,
				unionid: '',
				userLogo: avatarUrl,
			}
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			wx.utils.Toast('注册登录成功，请绑定您的手机号，快捷登录更方便')
			this.setPageTitle()
			await wx.utils.Login.simpleLogin()
			this.setData({
				userInfo: wx.utils.Login.userInfo,
				isLogin: wx.utils.Login.isBind
			})
		}
	},
	async bindPhone(e) {
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/wxUser/getPhone',
			data: {
				sessionKey: wx.utils.Login.sessionKey,
				encryptedData: e.detail.encryptedData,
				iv: e.detail.iv
			}
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			wx.utils.Toast('绑定成功')
			await wx.utils.Login.simpleLogin()
			setTimeout(() => {
				wx.navigateBack()
			}, 2000)
		}
	},
	async init() {
		wx.utils.showLoading()
		await wx.utils.Login.initUserInfo()
		this.setData({
			userInfo: wx.utils.Login.userInfo,
			isLogin: wx.utils.Login.isBind,
			phone: wx.utils.phone
		})
		wx.utils.hideLoading()
	},
	setPageTitle() {
		if (this.data.isLogin) {
			wx.setNavigationBarTitle({
				title: '绑定手机'
			})
		}
	},
	async onLoad() {
		await this.init()
		this.setPageTitle()
		
	}
});
