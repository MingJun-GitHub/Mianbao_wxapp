// import './utils/init'
import index from './utils/index'

wx.utils = index

App({
	async onLaunch() {
		// 初始化数据
		wx.utils.isIphoneHair = this.isIphoneHair()
		// await wx.utils.Login.initUserInfo()
	},
	// 流海
	isIphoneHair() {
		let deviceInfo = wx.getSystemInfoSync()
		let isIphoneX = /iPhone X/i.test(deviceInfo.model)
		let isIphoneXS = deviceInfo.platform === 'ios' && deviceInfo.pixelRatio === 3 && deviceInfo.screenWidth === 375 && deviceInfo.screenHeight === 812
		let isIphoneXSMAX = deviceInfo.platform === 'ios' && deviceInfo.pixelRatio === 3 && deviceInfo.screenWidth === 414 && deviceInfo.screenHeight === 896
		let isIphoneXR = deviceInfo.platform === 'ios' && deviceInfo.pixelRatio === 2 && deviceInfo.screenWidth === 414 && deviceInfo.screenHeight === 896
		return isIphoneX || isIphoneXS || isIphoneXSMAX || isIphoneXR
	},
	globalData: {
		// userInfo: null
	}
});
