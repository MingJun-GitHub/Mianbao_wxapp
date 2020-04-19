Component({
	properties: {
		item: {
			type: Object,
			value: {},
		},
		business: {
			type: Boolean, // 商家
			value: false
		}
	},
	data: {
		shopInfo: ''
	},
	methods: {
		copyPhone(e) {
			const {
				phone
			} = e.currentTarget.dataset
			wx.setClipboardData({
				data: phone,
				success: (res) => {
					wx.utils.Toast('复制成功')
				}
			})
		},
		toDeal(e) {		
			const {
				item
			} = e.currentTarget.dataset
			this.triggerEvent('todeal', item)	
		},
		goProduct(e) {
			const {
				merId,
				productId
			} = e.currentTarget.dataset.item
			console.log('merId', productId, merId)
			wx.navigateTo({url: `/pages/goods/index?merId=${merId}&id=${productId}`})
		}
	},
	lifetimes: {
		ready() {

		}
	}
});
