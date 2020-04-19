const app = getApp()
const title = ['提现', '充值', '积分兑换']
Page({
	data: {
		userInfo: null,
		hasPhone: false,
		money: 0,
		amount: 0,
		phone: '',
		getType: 0,
		getTypeIndex: 0,
		payData: [],
		payName: ['微信', '支付宝'],
		option: 0 // 0-提现， 1-充值  2-话费充值
	},
	// 充值话费
	async phoneCharge() {
		if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) {
			wx.utils.Toast('手机号码有误，请重填')
			return
		}
		if (this.data.amount <= 0) {
			wx.utils.Toast('请输入要充值的金额')
			return
		}
		if (this.data.amount < 0.01) {
			wx.utils.Toast('充值金额过小')
			return
		}
		if (this.data.amount <= this.data.money) {
			wx.utils.showLoading()
			const res = await wx.utils.Http.post({
				url: `/myInfo/addPhoneCharge`,
				data: {
					phone: this.data.phone,
					amount: this.data.amount
				}
			})
			wx.utils.hideLoading()
			if (res.code == 0) {
				wx.utils.Toast('充值成功，请耐心等待短信通知')
				await this.initMoney()
			} else {
				wx.utils.Toast(res.msg || '充值失败，请稍后重试')
			}
		} else {
			wx.utils.Toast('充值话费金额有误，超过可充值话费金额')
		}
		console.log('res', res)
	},
	async rechargeApply() {
		if (this.data.amount <= 0) {
			wx.utils.Toast('请输入提现金额')
			return
		}
		if (this.data.amount < 0.01) {
			wx.utils.Toast('提现金额过小')
			return
		}
		if (this.data.amount <= this.data.money) {
			wx.utils.showLoading()
			const res = await wx.utils.Http.get({
				url: '/myInfo/getMoney',
				data: {
					amount: this.data.amount
				}
			})
			wx.utils.hideLoading()
			if (res.code == 0) {
				wx.utils.Toast('提现成功，提现到帐时间预计2小时')
				await this.initMoney()
			} else {
				wx.utils.Toast(res.msg || '提现失败，请重试')
			}
		} else {
			wx.utils.Toast('提现金额有误,超过可提现金额')
		}
	},
	bindPickerPay(e) {
		this.setData({
			getTypeIndex: e.detail.value,
			getType: tihs.data.payData[e.detail.value].getType
		})
		// console.log('getTypeIndex', getType, getTypeIndex)
	},
	inputValue(e) {
		const {
			name
		} = e.currentTarget.dataset
		const {
			value
		} = e.detail
		console.log('value', value, parseFloat(value))
		this.setData({
			[name]: value
		})
	},
	blurValue(e) {
		const {
			name
		} = e.currentTarget.dataset
		const {
			value
		} = e.detail
		this.setData({
			[name]: parseFloat(value)
		})
	},
	async initMoney() {
		if (wx.utils.Login.loginPromise) {
			const res = await wx.utils.Login.getSaleMer()
			this.setData({
				money: Number(res.balance),
				amount: 0
			})
		}
	},
	goPage(e) {
		// console.log('e',e )
		wx.utils.goPage(e)
	},
	async findGetType() {
		const res = await wx.utils.Http.get({
			url: '/resource/findGetType'
		})
		if (res.code == 0) {
			let payName = []
			res.data.map(item => {
				payName.push(item.payName)
			})
			this.setData({
				payName,
				payData: res.data,
				getTypeIndex: 0,
				getType: res.data[0].getType
			})
		}
	},
	async createOrder() {
		const res = await wx.utils.Http.post({
			url: '/pay/createOrder',
			data: {
				amount: this.data.amount
			}
		})
		if (res.code == 0) {
			return res.data.orderId || ''
		} else {
			wx.utils.Toast(res.msg || '输入的充值金额不正确')
			return ''
		}
	},
	async createWXPay(orderId) {
		const res = await wx.utils.Http.post({
			url: '/pay/createWeiXinOrder',
			data: {
				orderId
			}
		})
		return res
	},
	async saveMoney() {
		if (this.data.amount <= 0) {
			wx.utils.Toast('请输入充值金额')
			return
		}
		if (this.data.amount < 0.01) {
			wx.utils.Toast('充值金额过小')
			return
		}
		const orderId = await this.createOrder()
		if (orderId) {
			const createBack = await this.createWXPay(orderId)
			if (createBack.code == 0) {
				var data = createBack.data
				const params = {
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.packageValue,
					signType: data.signType || 'MD5',
					paySign: data.paySign
				}
				wx.requestPayment({
					...params,
					success(res) {
						wx.utils.Toast('充值成功')
						setTimeout(() => {
							wx.navigateBack()
						}, 1200)
					},
					fail(res) {
						wx.utils.Toast('充值失败，请重新充值')
					}
				})
			} else {
				wx.utils.Toast(createBack.msg || '充值失败，请重新充值')
			}
		}
	},
	async onLoad(query) {
		this.setData({
			option: parseInt(query.option || 0),
			money: Number(query.money)
		})
		// await this.initMoney()
		await this.findGetType()
		wx.setNavigationBarTitle({
			title: title[this.data.option]
		})
	},
	onShow() {
		/*
		this.setData({
			hasPhone: !!wx.utils.Login.getPhone()
		})
		*/
	}
});
