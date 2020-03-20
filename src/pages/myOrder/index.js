const app = getApp()
Page({
	data: {
		isEnd: false,
		isIng: false,
		total: 0,
		pageNo: 1,
		pageSize: 20,
		orderStatus: 0,
		orderList: [],
	},
	async onReachBottom() {
		if (this.data.isEnd && this.data.isIng) {
			return
		}
		if (this.data.searchList.length < this.data.total) {
			this.setData({
				pageNo: this.data.pageNo + 1
			})
			await this.getOrderList()
		}
	},
	resetParams() {
		this.setData({
			pageNo: 1,
			pageSize: 20,
			isEnd: false,
			isIng: false,
			total: 0,
			orderList: []
		})
	},
	async changeTab(e) {
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
		await this.getOrderList()
	},
	async getOrderList() {
		if (this.data.isIng || this.data.isEnd) {
			return
		}
		this.setData({
			isIng: true
		})
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/myInfo/findMyOrders',
			data: {
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize,
				orderStatus: this.data.orderStatus
			}
		})
		this.setData({
			isIng: false,
			total: res.data.total
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			const orderList = [...this.data.orderList, ...res.data.records]
			console.log(orderList)
			this.setData({
				orderList,
				isEnd: this.data.total == orderList.length
			})
		}
	},
	async onLoad(query) {
		this.getOrderList()
	}
});
