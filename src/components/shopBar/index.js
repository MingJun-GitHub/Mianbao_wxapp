Component({
	properties: {
		data: {
			type: Object,
			value: {},
		}
	},
	data: {
		shopInfo: ''
	},
	methods: {
		goGoods(e) {
			let {item} = e.currentTarget.dataset
			wx.navigateTo({
				url: `/pages/goods/index?id=${item.id}`
			})
		},
		async addCollection(e) {
			let {item} = e.currentTarget.dataset
			await wx.utils.addCollect(item.id)
		},
		async getShopInfo() {
			const res = await wx.utils.Http.get({
				url: '/merShop/findSaleMerByMerId/1'
			})
			console.log('店铺数据==>', res)
			if (res.code==0) {
				this.setData({
					shopInfo: res.data.data
				})
			}
		}
	},
	lifetimes: {
		async ready() {
			// console.log('Ws', wx.utils)
			await  this.getShopInfo()
		}
	}
});
