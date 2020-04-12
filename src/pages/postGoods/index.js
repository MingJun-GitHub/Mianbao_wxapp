const app = getApp()
Page({
	data: {
		id: '',
		productName: '',
		stockNum: '',
		thumb: '',
		price: '',
		deletePrice: '',
		productDetails: [],
		date: '',
		time: '00:00',
		effectiveTime: ''
	},
	inputInfo(e) {
		var {
			tag
		} = e.currentTarget.dataset
		var {
			value
		} = e.detail
		this.setData({
			[`${tag}`]: value
		})
		console.log('this.', this.data)
	},
	bindDateChange(e) {
		this.setData({
			date: e.detail.value
		})
		this.setEffectiveTime()
	},
	bindTimeChange(e) {
		this.setData({
			time: e.detail.value
		})
		this.setEffectiveTime()
	},
	setEffectiveTime() {
		var date = this.data.date.replace(/-/ig, '/') + ' ' + this.data.time
		this.setData({
			effectiveTime: new Date(date).getTime()
		})
		console.log('effectiveTime', this.data.effectiveTime)
	},
	filterData() {
		if (!this.data.thumb) {
			wx.utils.Toast('请上传商品主题图')
			return
		}
		if (!this.data.productName) {
			wx.utils.Toast('请输入商品名称')
			return
		}
		if (this.data.price == '') {
			wx.utils.Toast('请输入促销价')
			return
		}

		if (this.data.deletePrice == '') {
			wx.utils.Toast('请输入划线价')
			return
		}

		if (this.data.stockNum == '') {
			wx.utils.Toast('请输入库存')
			return
		}
		if (!this.data.effectiveTime) {
			wx.utils.Toast('请选择商品截止时间')
			return
		}
		return true
	},
	async saveGoods() {
		if (!this.filterData()) {
			return
		}
		const res = await wx.utils.Http.post({
			url: this.data.id ? '/productInfo/updateProduct' : '/productInfo/addProduct',
			data: {
				id: this.data.id,
				productName: this.data.productName,
				price: this.data.price,
				stockNum: this.data.stockNum,
				thumb: this.data.thumb,
				effectiveTime: this.data.effectiveTime,
				productDetails: this.data.productDetails,
				deletePrice: this.data.deletePrice
			}
		})
		// 
		if(res.code==0) {
			wx.utils.Toast(this.data.id?'编辑成功':'添加商品成功')
			setTimeout(() => {
				wx.navigateBack()
			}, 1500)
		} else {
			wx.utils.Toast('操作失败，请重新尝试~')
		}
	},
	async uploadThumb() {
		this.chooseImage(1, async res => {
			wx.utils.showLoading('上传中...')
			const imgurl = await wx.utils.Http.uploadFile(res[0])
			this.setData({
				thumb: imgurl
			})
			wx.utils.hideLoading()
		})
	},
	async uploadList() {
		let length = 10 // 上传十张
		if (this.data.productDetails.length == length) {
			wx.utils.Toast('只能上传10张商品详情图')
			return
		}
		this.chooseImage(length - this.data.productDetails.length, async res => {
			wx.utils.showLoading('上传中...')
			var goods = [...this.data.productDetails]
			for (let i = 0; i < res.length; i++) {
				var imgurl = await wx.utils.Http.uploadFile(res[i])
				goods.push({
					imgurl,
					productId: this.data.id || ''
				})
			}
			console.log('goods', goods)
			this.setData({
				productDetails: goods
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
	deletePic(e) {
		const {
			index
		} = e.currentTarget.dataset
		console.log('e', e, index)
		const productDetails = [...this.data.productDetails]
		productDetails.splice(index, 1)
		this.setData({
			productDetails
		})
	},
	async getGoodsDetail(productId) {
		const res = await wx.utils.Http.get({
			url: `/productInfo/productDetail/${productId}`
		})
		if (res.code == 0) {
			const {
				productName,
				price,
				deletePrice,
				stockNum,
				thumb,
				effectiveTime
			} = res.data.contentProduct

			let productDetails = res.data.productDetail
			let splitDate = effectiveTime.split(' ')
			let date = splitDate[0]
			let time = splitDate[1].substr(0, 5)
			this.setData({
				productName,
				price,
				deletePrice,
				stockNum,
				thumb,
				effectiveTime,
				productDetails,
				date,
				time
			})
		}
	},
	async onLoad(query) {
		this.setData({
			id: query.id || ''
		})
		this.data.id && this.getGoodsDetail(this.data.id)
	}
});
