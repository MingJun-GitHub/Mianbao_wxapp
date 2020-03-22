const app = getApp()
// import behaviors from '../../behaviors/lazyImg'

Page({
	// behaviors: [behaviors],
	data: {
		goodsList: []
	},
	async getMyGoods() {
		const res = await wx.utils.Http.get({
			url: '/productInfo/listProduct/1'
		})
		if (res.code ==0 ) {
			this.setData({
				goodsList: res.data
			})
		}
	},
	goOrderList() {
		wx.navigateTo({
			url: `/pages/orderList/index`
		})
	},
	postMsg(e) {
		const {
			id
		} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/postMsg/index?id=${id}`
		})
	},
	goEditGoods(e) {	
		const {
			id
		} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/postGoods/index?id=${id}`
		})
	},
	async onLoad(query) {
		this.getMyGoods()
	}
});
