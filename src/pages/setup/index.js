const app = getApp()
import _ from 'lodash'
Page({
	data: {
		hasPromise: false,
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
	// 选择定位
	selectLocation() {
		wx.chooseLocation({
			success: (res) => {
				if (!res.name) {
					wx.utils.Toast('请选择位置')
					return
				}
				console.log('选择地址---》', res)
				this.setData({
					'shopInfo.shopAddress': res.name
				})
			},
			fail: (res) => {
				if (res.errMsg.indexOf('cancel') > -1) {
					console.log('用户没有手动选择新的定位')
				}
			}
		})
	},
	checkPromise() {
		return new Promise(resolve => {
			wx.getSetting({
				success: (res) => {
					if (_.isEmpty(res.authSetting, 'scope.userLocation') || res.authSetting[
							'scope.userLocation'] ===
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
	async getLocation(ischeck = false, callback) {
		ischeck && await this.checkPromise()
		wx.getLocation({
			type: 'gcj02',
			success: (e) => {
				console.log('e', e)
				this.setData({
					hasPromise: true
				})
				
				typeof callback == 'function' && callback()
			},
			fail: async () => {
				await this.checkPromise()
				// wx.utils.Toast('授权失败，请重新授权')
			}
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
	async onLoad() {
		const shopInfo = wx.getStorageSync('shopInfo')
		shopInfo && this.setData({
			shopInfo
		})
		await this.getLocation()
	}
});
