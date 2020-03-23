const app = getApp()
// import behaviors from '../../behaviors/lazyImg'

Page({
	// behaviors: [behaviors],
	data: {
		merId: '',
		goodsList: []
	},
	async getMyGoods() {
		const res = await wx.utils.Http.get({
			url: `/merShop/listmyProduct/${this.data.merId}`
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
		let  {
			id
		} = e.currentTarget.dataset
		id = id ? `?id=${id}` : ''
		wx.navigateTo({
			url: `/pages/postGoods/index${id}`
		})
	},
	onLoad(query) {
		this.setData({
			merId:query.merId
		})
	},
	async onShow() {
		this.getMyGoods()
	}
});
