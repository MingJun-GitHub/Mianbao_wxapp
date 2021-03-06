Component({
	properties: {
		merId: {
			type: Number,
			value: ''
		},
		showHongBao: {
			type: Boolean,
			value: true
		},
		money: {
			type: Number,
			value: ''
		}
	},
	data: {
		isGetHb: false
	},
	methods: {
		// 领红包
		async getHongBao() {
			if (!wx.utils.Login.getMobilePhone()) {
				wx.navigateTo({
					url: '/pages/login/index'
				})
				return
			}
			wx.utils.showLoading()
			const res = await wx.utils.Http.get({
				url: `/buyProduct/getRedBag/${this.data.merId}`
			})
			wx.utils.hideLoading()
			if (res.code == 0) {
				this.setData({
					isGetHb: true
				})
			} else {
				wx.utils.Toast(res.msg || '领取失败，新重新领取~')
			}
		},
		changeHongBao() {
			// this.setData({
			// 	showHongHao: !this.data.showHongHao
			// })
			this.setData({
				isGetHb: false
			})
			this.triggerEvent('close')
		},
	}
});
