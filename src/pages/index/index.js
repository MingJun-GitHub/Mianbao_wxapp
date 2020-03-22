// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef
Page({
	data: {
		goodsList: [],
		merId: ''
	},
	goGoods(e) {
		const {
			id
		} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/goods/index?id=${id}`,
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
	async onLoad(query) {
		this.setData({
			merId: query.merId
		})
		this.getShopGoodsList()
	}
});
