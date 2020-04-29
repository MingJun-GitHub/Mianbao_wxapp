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
	clipboardCode(e) {
		const {
			item
		} = e.currentTarget.dataset
		wx.setClipboardData({
			data: item.userName,
			success: (res) => {
				wx.utils.Toast('复制成功,快去微信搜索添加店家噢~')
			}
		})
	},
	goBack() {
		wx.navigateBack()
	},
	async onLoad() {
		await this.getRedPacket()
	}
});
