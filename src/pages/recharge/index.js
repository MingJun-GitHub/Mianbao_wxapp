const app = getApp()
const title = ['提现', '充值', '话费充值']
Page({
	data: {
		userInfo: null,
		money: 0,
		amount: 0,
		phone: '',
		option: 0 // 0-提现， 1-充值  2-话费充值
	},
	// 充值话费
	async phoneCharge() {
		if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) {
			wx.utils.Toast('手机号码有误，请重填')
			return
		}
		if (!this.data.amount) {
			wx.utils.Toast('请输入要充值的金额')
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
			if (res.code==0) {
				wx.utils.Toast('充值成功，请耐心等待短信通知')
				await this.initMoney()
			} else {
				wx.utils.Toast(res.msg||'充值失败，请稍后重试')
			}
		} else {
			wx.utils.Toast('充值话费金额有误')
		}
		console.log('res', res)
	},
	async rechargeApply() {
		if (!this.data.amount) {
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
				wx.utils.Toast(res.msg||'提现失败，请重试')
			}
		} else {
			wx.utils.Toast('提现金额有误')
		}
	},
	inputValue(e) {
		const {
			name
		} = e.currentTarget.dataset
		const {
			value
		} = e.detail
		this.setData({
			[name]: Number(value)
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
	async onLoad(query) {
		this.setData({
			option: parseInt(query.option || 0)
		})
		await this.initMoney()
		wx.setNavigationBarTitle({
			title: title[this.data.option]
		})
	}
});
