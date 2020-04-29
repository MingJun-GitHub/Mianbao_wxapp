class Login {
	// 初始化
	constructor() {
		this.loginPromise = null
		this.isLogin = false
		this.isBindPhone = false // 是否绑定电话
		this.mobilePhone = '' 
		this.token = ''
		this.sessionKey = ''
		this.userInfo = null
	}
	/**
	 * 登录初始化
	 */
	async initUserInfo(cb) {
		if (!this.loginPromise) {
			this.loginPromise = new Promise(async resolve => {
				if (this.userInfo) {
					typeof cb === 'function' && cb(this.userInfo)
					resolve(this.userInfo)
				} else {
					const loginInifo = wx.getStorageSync('loginInfo')
					if (loginInifo) {
						this.token = loginInifo.token
						this.sessionKey = loginInifo.sessionKey
						await this.getUserInfo()
						resolve(this.userInfo)
						return
					}
					wx.login({
						success: async (res) => {
							const result = await wx.utils.Http.get({
								url: '/wxUser/login',
								data: {
									wxcode: res.code
								}
							})
							if (result.code == 0) {
								wx.setStorageSync('loginInfo', result.data)
								this.token = result.data.token
								this.sessionKey = result.data.sessionKey
							} else {
								console.log('系统出错了', res)
								this.clearUserInfo()
							}
							await this.getUserInfo()
							resolve(this.userInfo)
						}
					})
				}
			})
		}
		return this.loginPromise
	}
	/**
	 * 重新登录
	 */
	async reloadLogin() {
		this.clearUserInfo()
		await this.initUserInfo()
	}
	/**
	 * 简单登录，会重置loginPromise拦截
	 */
	async simpleLogin() {
		this.loginPromise = null
		await this.getUserInfo()
	}
	/**
	 * 清除登录信息，重置
	 */
	clearUserInfo() {
		wx.removeStorageSync('loginInfo')
		this.loginPromise = null
		this.userInfo = null
		this.isBindPhone = false
		this.mobilePhone = ''
		this.isLogin = false
	}
	/**
	 * 获取电话
	 */
	getMobilePhone() {
		return this.mobilePhone
	}
	/**
	 * 是否登录（不包含是否绑定手机号） 
	 */
	checkLogin() {
		return this.isLogin
	}
	/**
	 * 检查是否绑定手机号
	 */
	async checkBindMobile() {
		const res = await wx.utils.Http.get({
			url: '/wxUser/isGetUserInfo',
			header: {
				token: this.token
			}
		})
		if (res.code == 0) {
			this.isBindPhone = res.data
			return res.data
		} else {
			return false
		}
	}
	/**
	 * 获取用户悠 信息
	 */
	async getUserInfo(filter = false) {
		const res = await wx.utils.Http.get({
			url: '/wxUser/getUserInfoById',
			header: {
				token: this.token
			}
		})
		if (res.code == 0) {
			this.userInfo = res.data
			this.mobilePhone = this.userInfo.phone
			this.isBindPhone = !!this.mobilePhone
			this.isLogin = !!this.userInfo.nickName // 有头像昵称才算登录
			return res.data
		} else {
			if (res.status == 500) { // 登录态过期，重新登录
				await this.reloadLogin()
			}
			return this.userInfo || null
		}
	}
	/**
	 * 这个只有给力点用的上，保留着
	 */
	async getSaleMer() {
		const res = await wx.utils.Http.get({
			url: '/wxUser/getUserInfoById'
		})
		if (res.code == 0) {
			return res.data
		} else {
			return ''
		}
	}
}

export default new Login()
