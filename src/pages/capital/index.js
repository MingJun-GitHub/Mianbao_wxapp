const app = getApp()
Page({
	data: {
		isEnd: false,
		isIng: false,
		total: 0,
		getType: '',
		pageNo: 1,
		pageSize: 20,
		dataList: [],
		getStatus: ['提现中', '提现成功', '提现失败'],
		chargeOrderStatus: ['充值中', '充值成功', '充值失败'],
		title: ['提现记录', '提现记录', '充值话费记录'],
		option: 0,
		phone: '',
		amout: ''
	},
	async onReachBottom() {
		if (this.data.isEnd && this.data.isIng) {
			return
		}
		if (this.data.dataList.length < this.data.total) {
			this.setData({
				pageNo: this.data.pageNo + 1
			})
			await this.getDataList()
		}
	},
	resetParams() {
		this.setData({
			pageNo: 1,
			pageSize: 20,
			isEnd: false,
			isIng: false,
			total: 0,
			dataList: []
		})
	},
	async selectTab(e) {
		const {
			index
		} = e.currentTarget.dataset
		if (index == this.data.orderStatus) {
			return
		}
		this.resetParams()
		this.setData({
			orderStatus: index
		})
		await this.getDataList()
	},
	async getDataList() {
		if (this.data.isIng || this.data.isEnd) {
			return
		}
		this.setData({
			isIng: true
		})
		wx.utils.showLoading()
		let url = ['/myInfo/findGetMoneyRecord', '', '/myInfo/findPhoneChargeRecord'][this.data.option]
		let params = this.data.option == 0 ? {
			getType: this.data.getType
		} : (this.data.getType == 1 ? {} : {
			phone: this.data.phone,
			amout: this.data.amout
		})
		const res = await wx.utils.Http.get({
			url,
			data: {
				// currentpage: this.data.currentpage,
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize,
				...params
			}
		})
		this.setData({
			isIng: false,
			total: res.data.total
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			const dataList = [...this.data.dataList, ...res.data.records]
			console.log(dataList)
			this.setData({
				dataList,
				isEnd: this.data.total == dataList.length
			})
		}
	},
	handleChange(e) {
		const {
			name
		} = e.currentTarget.dataset
		this.setData({
			[name]: e.detail.dateString
		})
	},
	async onLoad(query) {
		this.setData({
			option: query.option||0
		})
		wx.setNavigationBarTitle({
			title: this.data.title[this.data.option]
		})
		this.getDataList()
	}
});
