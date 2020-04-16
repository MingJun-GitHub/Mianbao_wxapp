const app = getApp()
Page({
	data: {
		pageNo: 1,
		pageSize: 100,
		userList: [],
		hasCheckedList: [],
		allCheckedStauts: false,
		content: ''
	},
	inputContent(e) {
		this.setData({
			content: e.detail.value
		})
	},
	filterHasChecked() {
		var hasCheckedList = [...this.data.userList]
		// 过滤
		hasCheckedList = hasCheckedList.filter(item => {
			return item.is_checked
		})
		this.setData({
			hasCheckedList,
			allCheckedStauts: hasCheckedList.length === this.data.userList.length
		})
	},
	selectSku(e) {
		const {
			index
		} = e.currentTarget.dataset
		this.setData({
			[`userList[${index}].is_checked`]: !this.data.userList[index].is_checked
		})
		this.filterHasChecked()
	},
	async findMyConsumer() {
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: '/merShop/findMyConsumer',
			data: {
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize
			}
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			res.data.records.map(item => {
				item.is_checked = false
			})
			this.setData({
				userList: res.data.records
			})
		}
		this.filterHasChecked()
	},
	checkedAll(e) {
		var userList = [...this.data.userList]
		userList.map(item => {
			item.is_checked = !this.data.allCheckedStauts
		})
		this.setData({
			userList,
			allCheckedStauts: !this.data.allCheckedStauts
		})
		this.filterHasChecked()
	},
	async sendMsg() {
		if (!this.data.content) {
			wx.utils.Toast('请输入短信内容')
			return
		}
		wx.utils.showLoading()
		var msgLogs = []
		this.data.hasCheckedList.forEach(item => {
			if (item.phone) {
				msgLogs.push({
					id: item.id,
					toMoblie: item.phone
				})
			}
		})
		const res = await wx.utils.Http.post({
			url: '/merShop/sendMsg',
			data: {
				msg: this.data.content,
				msgLogs
			}
		})
		wx.utils.hideLoading()
		if (res.code == 0) {
			wx.utils.Toast('发送成功')
		} else {
			wx.utils.Toast(res.msg || '发送失败，请重新尝试~')
		}
	},
	scanCode() {
		wx.scanCode({
			onlyFromCamera: false,
			scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
			success: (result) => {
				console.log('res-->', result)
			},
			fail: () => {},
			complete: () => {}
		});
	},
	async onLoad(query) {
		await this.findMyConsumer()
	}
});
