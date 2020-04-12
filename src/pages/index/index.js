// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef
Page({
	data: {
		shopList: [],
		goodsList: [],
		merId: '',
		isLoaded: false
	},
	goGoods(e) {
		const {
			id
		} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/goods/index?id=${id}&merId=${this.data.merId}`,
		});
	},
	async getShopGoodsList() {
		const res = await wx.utils.Http.get({
			url: `/productInfo/listProduct/${this.data.merId}`
		})
		console.log('商铺商品数据', res)
		if (res.code == 0) {
			this.setData({
				goodsList: res.data
			})
		}
	},
	async getShopList() {
		const res = await wx.utils.Http.get({
			url: `/merShop/merListShop`
		})
		if (res.code == 0) {
			this.setData({
				shopList: res.data
			})
		}
	},
	lookShop(e) {
		// console.log('e', e)
		const {
			merid
		} = e.currentTarget.dataset
		console.log('merDi', merid)
		this.setData({
			merId: merid
		})
		wx.reLaunch({
			url: `/pages/index/index?merId=${this.data.merId}`
		})
		// this.getShopGoodsList()
	},
	async onLoad(query) {
		wx.utils.showLoading()
		this.setData({
			merId: query.merId || ''
		})
		if (this.data.merId) {
			await this.getShopGoodsList()
		} else {
			await this.getShopList()
		}
		wx.setNavigationBarTitle({
			title: this.data.merId ? '店铺' : '特色商品'
		})
		setTimeout(() => {
			this.setData({
				isLoaded: true
			})
			wx.utils.hideLoading()
		}, 0)

		// this.getShopGoodsList()
	}
});
