const app = getApp()
import _ from 'lodash'
Page({
	data: {
		wxcode: 'http://pic.gtqad.com/shopCode.png',
		hasPromise: true
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
		// await this.checkPromise()
		this.setData({
			wxcode: decodeURIComponent(query.wxcode || this.data.wxcode)
		})
	}
});
