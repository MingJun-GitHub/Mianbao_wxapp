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
		showLeaveMsg: false,
		leaveMsg: '',
		curSelect: ''
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
			url: '/merShop/listOrder',
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
	toDeal(e) {
		this.changeLeaveMsg()
		this.setData({
			curSelect: e.detail
		})
	},
	changeLeaveMsg() {
		this.setData({
			showLeaveMsg: !this.data.showLeaveMsg
		})
	},
	inputLeaveMsg(e) {
		this.setData({
			leaveMsg: e.detail.value
		})
	},
	async saveMsg() {
		wx.utils.showLoading()
		const res= await wx.utils.Http.get({
			url: '/merShop/updateOrderStatus',
			data: {
				id: this.data.curSelect.id,
				replymsg: this.data.leaveMsg,
			}
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			wx.utils.Toast('处理成功')
			this.changeLeaveMsg()
			this.setData({
				leaveMsg: ''
			})
			this.resetParams()
			this.getOrderList()
		} else {
			wx.utils.Toast('处理失败，请重试')
		}
	},
	async onLoad(query) {
		this.getOrderList()
	}
});
