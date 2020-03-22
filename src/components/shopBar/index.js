Component({
	properties: {
		openShare: {
			type: Boolean,
			value: false
		},
		openEdit: {
			type: Boolean,
			value: false
		},
		merId: {
			type: String,
			value: ''
		}
	},
	data: {
		saleMer: '',
		vistCount: ''
	},
	methods: {
		goShopCode() {
			wx.navigateTo({
				url: '/pages/shopCode/index'
			})
		},
		clipboardCode() {
			wx.setClipboardData({
				data: this.data.saleMer.userName,
				success: (res) => {
					wx.utils.Toast('复制成功')
				}
			})
		},
		async addCollection(e) {
			let {
				item
			} = e.currentTarget.dataset
			await wx.utils.addCollect(item.id)
		},
		async getShopInfo() {
			const res = await wx.utils.Http.get({
				url: this.data.merId?`/merShop/findSaleMerByMerId/${this.data.merId}`:`/merShop/findSaleMer`
			})
			console.log('店铺数据==>', res)
			if (res.code == 0) {
				this.setData({
					saleMer: res.data.saleMer,
					vistCount: res.data.vistCount
				})				
			}
		}
	},
	lifetimes: {
		async ready() {
			console.log('this.data', this.data.merId)
			await this.getShopInfo()
		}
	}
});
