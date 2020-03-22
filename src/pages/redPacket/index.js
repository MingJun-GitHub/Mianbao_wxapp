const app = getApp()
Page({
	data: {
		userInfo: null,
		isLogin: false,
		hasPhone: '',
		redPacketList: [],
		allMoney: 0,
		backgroundColorTop: 'transportant'
	},
	async init() {
		wx.utils.showLoading()
		await wx.utils.Login.initUserInfo()
		this.setData({
			userInfo: wx.utils.Login.userInfo,
			isLogin: wx.utils.Login.isBind,
			phone: wx.utils.Login.phone
		})
		wx.utils.hideLoading()
	},
	async getRedPacket() {
		const res = await wx.utils.Http.get({
			url: '/myInfo/findRedBagRecord'
		})
		if (res.code == 0) {
			this.setData({
				allMoney: res.data.allMOney,
				redPacketList: res.data.saleMerVos
			})
		}
		console.log('this.data', this.data.redPacketList)
		
	},
	goBack() {
		wx.navigateBack()
	},
	async onLoad() {
		await this.init()
		await this.getRedPacket()
	}
});
