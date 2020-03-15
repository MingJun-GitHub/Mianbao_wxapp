Component({
	properties: {
		data: {
			type: Object,
			value: {},
		}
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
		}
	}
});
