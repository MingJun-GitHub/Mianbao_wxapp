const app = getApp()
const title = ['提现', '充值', '话费充值']
Page({
	data: {
		userInfo: null,
		money: 0,
		option: 0 // 0-提现， 1-充值  2-话费充值
	},
	// 充值话费
	phoneCharge() {

	},
	inputValue(e) {
		const {
			value
		} = e.detail
		this.setData({
			
		})
	},
	onLoad(query) {
		this.setData({
			money: parseInt(query.money || 0),
			option: parseInt(query.option || 0)
		})
		wx.setNavigationBarTitle({
			title: title[this.data.option]
		})
	}
});
