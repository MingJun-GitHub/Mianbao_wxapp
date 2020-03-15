// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef
Page({
	data: {
		goodsList: [],
		backgroundColorTop: 'transparent',
		pageNo: 1,
		pageSize: 10,
		isIng: false,
		isEnd: false,
		total: 0,
		productGroupId: 2,
		banner: null
	},
	goSearch() {
		wx.navigateTo({
			url: '/pages/search/index',
		});
	},
	async onPullDownRefresh() {
		this.setData({
			isIng: false,
			isEnd: false,
			pageNo: 1,
			goodsList: []
		})
		await this.getHomeGoodsList()
		wx.stopPullDownRefresh()
	},
	onPageScroll(e) {
		let {
			scrollTop
		} = e
		if (scrollTop >= 100) {
			this.setData({
				backgroundColorTop: '#f12b5f'
			})
		} else {
			this.setData({
				backgroundColorTop: 'transparent'
			})
		}
	},

	// 获取首页商品列表
	async getHomeGoodsList() {
		if (this.data.isIng || this.data.isEnd) {
			return
		}
		this.setData({
			isIng: true
		})
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: `/home/listProductPage`,
			data: {
				pageNo: this.data.pageNo,
				pageSize: this.data.pageSize,
				productGroupId: this.data.productGroupId
			}
		})
		wx.utils.hideLoading()
		this.setData({
			isIng: false,
			total: res.data.total
		})
		if (res.code == 0) {
			const goodsList = [...this.data.goodsList, ...res.data.records]
			this.setData({
				goodsList,
				isEnd: this.data.total == goodsList.length
			})
		}
		console.log('thsidata', this.data)
	},
	async getBanner() {
		const res = await wx.utils.Http.get({
			url: '/home/findBanner'
		})
		if (res.code ==0) {
			this.setData({
				banner: res.data.bannerUrl
			})
		}
		console.log('res', res)
	},
	async onReachBottom() {
		if (this.data.isEnd && this.data.isIng) {
			return
		}
		if (this.data.searchList.length < this.data.total) {
			this.setData({
				pageNo: this.data.pageNo + 1
			})
			await this.getHomeGoodsList()
		}
	},
	async onLoad() {
		this.getBanner()
		await this.getHomeGoodsList()
	}
});
