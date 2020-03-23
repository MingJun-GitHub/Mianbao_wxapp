const app = getApp()
Page({
	data: {},
	saveCode() {
		wx.downloadFile({
			url: 'http://q77wqdcvr.bkt.clouddn.com/shopCode.png', //仅为示例，并非真实的资源
			success: (res) => {
				if (res.statusCode === 200) {
					wx.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success(res2) {
							wx.showToast({
								title: '保存图片成功！',
							})
						},
						fail(res2) {
							wx.showToast({
								title: '保存图片失败！',
							})
						}
					})
				}
			}
		})
	}
});
