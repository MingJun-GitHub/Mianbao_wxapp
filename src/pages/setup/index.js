const app = getApp()
Page({
	data: {
		shopInfo: {
			balance: 0,
			gErWeiMaLogo: '',
			createTime: '',
			erWeiMaLogo: '',
			id: '',
			isEnable: '',
			redBagAmount: 0,
			shopAddress: '',
			shopLogo: '',
			shopName: '',
			userName: '',
		}	
	},
	async uploadThumb() {
		this.chooseImage(1, async res => {
			wx.utils.showLoading('上传中...')
			const imgurl = await wx.utils.Http.uploadFile(res[0])
			this.setData({
				'shopInfo.shopLogo': imgurl
			})
			wx.utils.hideLoading()
		})
	},
	// 选择图片
	async chooseImage(count, callback) {
		// saleapi/merShop/findSaleMerByMerId/1
		wx.chooseImage({
			count,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				const tempFilePaths = res.tempFilePaths
				await callback(tempFilePaths)
			}
		})
	},
	setInputValue(e) {
		const {
			name
		} = e.currentTarget.dataset
		const {
			value
		} = e.detail
		console.log('value', value, name)
		this.setData({
			['shopInfo.'+name]: value
			// `shopInfo.${name}`: value
		})
	},
	async saveShopInfo() {	
		wx.utils.showLoading()
		const res = await wx.utils.Http.post({
			url: '/merShop/updateShop',
			data: this.data.shopInfo
		})
		wx.utils.hideLoading()
		if (res.code==0) {
			wx.utils.Toast('保存成功')
			setTimeout(() => {
				wx.navigateBack()
			}, 1500);
		}
		console.log('res', res)
		console.log('this.shopDAta', this.data.shopInfo)
	},
	onLoad() {
		const shopInfo = wx.getStorageSync('shopInfo')

		shopInfo && this.setData({
			shopInfo
		})
	}
});
