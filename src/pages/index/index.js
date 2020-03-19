// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef
Page({
	data: {
		goodsList: [],
		merId: 1
	},
	goSearch() {
		wx.navigateTo({
			url: '/pages/search/index',
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
	async onLoad() {
		this.getShopGoodsList()
	}
});
