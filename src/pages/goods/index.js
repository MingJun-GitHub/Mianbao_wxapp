const app = getApp()
Page({
	data: {
		id: '',
		merId: '',
		backgroundColorTop: 'transportant',
		goodsDetails: '',
		showLeaveMsg: false,
		leavemsg: false,
		leaveMsg: '',
		money: 0,
		showHongHao: false,
		isGetHb: false
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
	async saveMsg(e) {
		console.log('留言', )
		if (!this.data.leaveMsg) {
			wx.utils.Toast('请输入留言')
		} else {
			wx.utils.showLoading()
			const res = await wx.utils.Http.post({
				url: '/buyProduct/addProduct',
				data: {
					merId: this.data.merId,
					msg: this.data.leaveMsg,
					productId: this.data.id
				}
			})
			wx.utils.hideLoading()
			if (res.code == 0) {
				wx.utils.Toast('已经留言给老板了')
				this.setData({
					leaveMsg: ''
				})
				this.changeLeaveMsg()
			} else {
				wx.utils.Toast('提交失败，请稍后重试')
			}
			console.log('res', res)
		}
	},
	// 领红包
	async getHongBao() {
		wx.utils.showLoading()
		const res = await wx.utils.Http.get({
			url: `/buyProduct/getRedBag/${this.data.merId}`
		})
		console.log('领取红包状态', res)
		wx.utils.hideLoading()
		if (res.code == 0) {
			this.setData({
				isGetHb: true
			})
		} else {
			wx.utils.Toast('领取失败，新重新领取~')
		}
	},
	changeHongBao() {
		this.setData({
			showHongHao: !this.data.showHongHao
		})
	},
	async getHongBaoMoney() {
		const res = await wx.utils.Http.get({
			url: `/merShop/findSaleMerByMerId/${this.data.merId}`
		})
		if (res.code ==0) {
			this.setData({
				money: res.data.saleMer.redBagAmount
			})
		}
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
			id: query.id || '',
			merId: query.merId || 1
		})
		this.data.id && await this.getGoodsDetail(this.data.id)
		this.data.merId && await this.getHongBaoMoney()
		wx.setNavigationBarTitle({
			title: this.data.goodsDetails.contentProduct.productName || '商品详情'
		})
	}
});
