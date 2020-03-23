const app = getApp()
Page({
	data: {
		startTime: '',
		endTime: '',
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
		if (this.data.searchList.length < this.data.total) {
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
				// currentpage: this.data.currentpage,
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize,
				orderStatus: this.data.orderStatus == -1? '' : this.data.orderStatus,
				startTime:  this.data.orderStatus == -1 ? this.data.startTime:'',
				endTime:  this.data.orderStatus == -1? this.data.endTime: ''
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
	goSearch() {
		if (!this.data.startTime || !this.data.endTime) {
			wx.utils.Toast('请选择开始结束时间')
			return
		}
		if (new Date(this.data.startTime) > new Date(this.data.endTime)) {
			wx.utils.Toast('开始时间不能大于结束时间')
		} else {
			this.resetParams()
			this.getDataList()
		}
	},
	async onLoad(query) {
		this.getDataList()
	}
});
