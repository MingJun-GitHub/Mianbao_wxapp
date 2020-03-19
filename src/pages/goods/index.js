const app = getApp()
Page({
	data: {
		id: '',
		backgroundColorTop: 'transportant',
		goodsDetails: '',
		showLeaveMsg: false,
		leavemsg: false,
		leaveMsg: ''
	},
	goLogin() {
		if (this.data.isLogin) {
			return
		}
		wx.navigateTo({
			url: '/pages/login/index'
		})
	},
	async getGoodsDetail(productId) {
		const res = await wx.utils.Http.get({
			url: `/productInfo/productDetail/${productId}`
		})
		if (res.code == 0) {
			this.setData({
				goodsDetails: res.data
			})
		}
	},
	goBack() {
		const router = getCurrentPages()
		if (router.length >= 2) {
			wx.navigateBack()
		} else {
			this.goHome()
		}
	},
	goHome() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	changeLeaveMsg() {
		this.setData({
			showLeaveMsg: !this.data.showLeaveMsg
		})
	},
	saveMsg() {
		
	},
	inputLeaveMsg(e) {
		const {
			value 
		} = e.detail
		this.setData({
			leaveMsg: value
		})
	},
	// onPageScroll(e) {
	// 	console.log('s', e)
	// 	let {
	// 		scrollTop
	// 	} = e
	// 	if (scrollTop >= 10) {
	// 		this.setData({
	// 			backgroundColorTop: '#FF4E00'
	// 		})
	// 	} else {
	// 		this.setData({
	// 			backgroundColorTop: 'transparent'
	// 		})
	// 	}
	// },
	async onLoad(query) {
		this.setData({
			id: query.id || ''
		})
		this.data.id && await this.getGoodsDetail(this.data.id)
		wx.setNavigationBarTitle({
			title: this.data.goodsDetails.contentProduct.productName || '商品详情'
		})
	}
});
