// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef
Page({
	data: {
		shopInfo: {},
		shopList: [],
		goodsList: [],
		merId: '',
		showHongBao: false,
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
		const {
			merid
		} = e.currentTarget.dataset
		this.setData({
			merId: merid
		})
		wx.reLaunch({
			url: `/pages/index/index?merId=${this.data.merId}`
		})
	},
	onShareAppMessage(options){
		return {
			title: this.data.merId ? this.data.shopInfo.shopName : '福利大派送，红包你也一起来领',
			path: '/pages/index/index' + (this.data.merId ? `?merId=${this.data.merId}`:''),
			imageUrl: this.data.merId ? (this.data.shopInfo.shopLogo || '') : ''
		}
	},
	returnGetShopInfo(e) {
		this.setData({
			shopInfo: e.detail.saleMer
		})
	},
	changeHongbao() {
		this.setData({
			showHongBao: !this.data.showHongBao
		})
	},
	async onLoad(query) {
		wx.utils.showLoading()
		if (query) {
			this.setData({
				merId: query.merId || query.scene  || ''
			})
		} else {
			this.setData({
				merId: wx.utils.merId || ''
			})
		}
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
	}
});
