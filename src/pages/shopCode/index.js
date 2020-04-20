const app = getApp()
import _ from 'lodash'
Page({
	data: {
		wxcode: 'http://pic.gtqad.com/shopCode.png',
		hasPromise: true,
		shopInfo: ''
	},
	saveCode() {
		wx.downloadFile({
			url: this.data.wxcode, //仅为示例，并非真实的资源
			success: (res) => {
				if (res.statusCode === 200) {
					wx.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: (res2) => {
							wx.showToast({
								title: '保存图片成功！',
							})
						},
						fail: async (res2) => {
							if (res2.errMsg=='saveImageToPhotosAlbum:fail auth deny') {
								await this.checkPromise()
								wx.utils.Toast('保存图片失败，请打开保存图片授权')
								return
							}
							wx.showToast({
								title: '保存图片失败！',
							})
						}
					})
				}
			}
		})
	},
	onShareAppMessage(options){
		return {
			title: this.data.merId ? this.data.shopInfo.shopName : '福利大派送，红包你也一起来领',
			path: '/pages/index/index' + (this.data.merId ? `?merId=${this.data.merId}`:''),
			imageUrl: this.data.merId ? (this.data.shopInfo.bgErWeiMaLogo || '') : ''
		}
	},
	checkPromise() {
		return new Promise(resolve => {
			wx.getSetting({
				success: (res) => {
					if (_.isEmpty(res.authSetting, 'scope.writePhotosAlbum') || res.authSetting[
							'scope.writePhotosAlbum'] ===
						false) {
						this.setData({
							hasPromise: false
						})

						resolve()
					} else {
						this.setData({
							hasPromise: true
						})
						resolve()
					}
				},
				fail: () => {
					resolve()
				}
			})
		})
	},
	async openSetting(e) {
		await this.checkPromise()
	},
	async onLoad(query) {
		const shopInfo = wx.utils.shopInfo || ''
		console.log('shopInfo', shopInfo)
		this.setData({
			shopInfo,
			merId: shopInfo.id,
			wxcode: decodeURIComponent(shopInfo.bgErWeiMaLogo || this.data.wxcode)
		})
	}
});
