const app = getApp()
/*
{
	"createTime": "2020-03-18T13:28:47.714Z",
	"deletePrice": 0,
	"effective_time": "2020-03-18T13:28:47.714Z",
	"id": 0,
	"price": 0,
	"productDetails": [
	  {
		"createTime": "2020-03-18T13:28:47.715Z",
		"deleted": 0,
		"id": 0,
		"imgType": "string",
		"imgurl": "string",
		"productId": 0
	  }
	],
	"productName": "string",
	"stockNum": 0,
	"thumb": "string"
  }
*/
Page({
	data: {
		id: '',
		productName: '',
		stockNum: '',
		thumb: '',
		price: '',
		deletePrice: '',
		// productDetails: [{
		// 	imgurl: 'https://img.suxianfood.com/20200318225821011'
		// }, {
		// 	imgurl: 'https://img.suxianfood.com/20200318225821011'
		// }],
		productDetails: [],
		date: '',
		time: '00:00',
		effective_time: ''
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
		this.setData({
			effective_time: new Date(this.data.date + ' ' + this.data.time).getTime()
		})
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
		if (this.data.price=='') {
			wx.utils.Toast('请输入促销价')
			return
		}
		
		if (this.data.deletePrice=='') {
			wx.utils.Toast('请输入划线价')
			return
		}
		
		if (this.data.stockNum=='') {
			wx.utils.Toast('请输入库存')
			return
		}
		if (!this.data.effective_time) {
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
			url: '/productInfo/addProduct',
			data: {
				id: this.data.id,
				productName: this.data.productName,
				price: this.data.price,
				stockNum: this.data.stockNum,
				thumb: this.data.thumb,
				effective_time: this.data.effective_time,
				productDetails: this.data.productDetails,
				deletePrice: this.data.deletePrice
			}
		})
		console.log('res==>', res)
	},
	async uploadThumb() {
		this.chooseImage(1, async res => {
			const imgurl = await wx.utils.Http.uploadFile(res[0])
			this.setData({
				thumb: imgurl
			})
		})
	},
	async uploadList() {
		let length = 10 // 上传十张
		if (this.data.productDetails.length == length) {
			wx.utils.Toast('只能上传10张商品详情图')
			return
		}
		this.chooseImage(length - this.data.productDetails.length, async res => {
			var goods = [...this.data.productDetails]
			console.log('goods-->', goods)

			for(let i =0; i<res.length; i++) {
				var imgurl = await wx.utils.Http.uploadFile(res[i])
				goods.push({
					imgurl
				})
			}
			console.log('goods', goods)
			this.setData({
				productDetails: goods
			})
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
	getGoodsDetail() {

	},
	async onLoad(query) {
		this.setData({
			id: query.id || ''
		})
	}
});
