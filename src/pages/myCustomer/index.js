const app = getApp()
Page({
	data: {
		isEnd: false,
		isIng: false,
		total: 0,
		currentpage: 0,
		pageNo: 1,
		pageSize: 20,
		orderStatus: 0,
		dataList: []
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
		const res = await wx.utils.Http.get({
			url: '/merShop/findMyConsumer',
			data: {
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize
			}
		})
		this.setData({
			isIng: false,
			total: res.data.total
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			const dataList = [...this.data.dataList, ...res.data.records]
			this.setData({
				dataList,
				isEnd: this.data.total == dataList.length
			})
		}
	},
	async onLoad(query) {
		this.getDataList()
	}
});
