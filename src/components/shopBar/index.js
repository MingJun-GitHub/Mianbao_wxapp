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
		},
		shopSet: {
			type: Boolean,
			value: false
		},
		openUpdate: {
			type: Boolean,
			value: true
		}
	},
	data: {
		saleMer: '',
		vistCount: ''
	},
	methods: {
		goShopCode() {
			wx.utils.shopInfo = this.data.saleMer
			wx.navigateTo({
				url: `/pages/shopCode/index`
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
				this.triggerEvent('getShopInfo', res.data)	
			}
		},
		goMerEdit() {
			wx.setStorageSync('shopInfo', this.data.saleMer)
			setTimeout(() => {
				wx.navigateTo({
					url: this.data.shopSet ? '/pages/shopSet/index':'/pages/setup/index'
				})	
			}, 10)	
		}
	},
	pageLifetimes: {
		async show() {
			this.data.openUpdate && await this.getShopInfo()
		}
	},
	lifetimes: {
		async ready() {
			!this.data.openUpdate && await this.getShopInfo()
		}
	}
});
