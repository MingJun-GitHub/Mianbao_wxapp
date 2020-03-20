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
		}
	},
	lifetimes: {
		ready() {

		}
	}
});
