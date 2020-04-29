const app = getApp()
Page({
	data: {
		merId: '',
		goodsList: [],
		openDelete: false,
		startX: 0,
		startY: 0
	},
	async getMyGoods() {
		const res = await wx.utils.Http.get({
			url: `/merShop/listmyProduct/${this.data.merId}`
		})
		if (res.code ==0 ) {
			res.data.map(item => {
				item.isTouchMove = false
			})
			this.setData({
				goodsList: res.data,
			})
		}
	},
	goOrderList() {
		wx.navigateTo({
			url: `/pages/orderList/index`
		})
	},
	postMsg(e) {
		const {
			id
		} = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/postMsg/index?id=${id}`
		})
	},
	goEditGoods(e) {	
		let  {
			id
		} = e.currentTarget.dataset
		id = id ? `?id=${id}` : ''
		wx.navigateTo({
			url: `/pages/postGoods/index${id}`
		})
	},
	//手指触摸动作开始 记录起点X坐标
	touchstart(e) {
		if (!this.data.openDelete) {
			return
		}
		//开始触摸时 重置所有删除
		this.data.goodsList.forEach(v => {
			if (v.isTouchMove)
				v.isTouchMove = false
		})
		this.setData({
			startX: e.changedTouches[0].clientX,
			startY: e.changedTouches[0].clientY,
			goodsList: this.data.goodsList
		})
	},
	//滑动事件处理
	touchmove(e) {
		if (!this.data.openDelete) {
			return
		}
		var index = e.currentTarget.dataset.index, //当前索引
			startX = this.data.startX, //开始X坐标
			startY = this.data.startY, //开始Y坐标
			touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
			touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
			//获取滑动角度
			angle = this.angle({
				X: startX,
				Y: startY
			}, {
				X: touchMoveX,
				Y: touchMoveY
			})
		this.data.goodsList.forEach((v,i) => {
			v.isTouchMove = false
			//滑动超过30度角 return
			if (Math.abs(angle) > 30) return
			if (i == index) {
				if (touchMoveX > startX) //右滑
					v.isTouchMove = false
				else //左滑
					v.isTouchMove = true
			}
		})
		//更新数据
		this.setData({
			goodsList: this.data.goodsList
		})
	},
	/**
	 * 计算滑动角度
	 * @param {Object} start 起点坐标
	 * @param {Object} end 终点坐标
	 */
	angle(start, end) {
		var _X = end.X - start.X,
			_Y = end.Y - start.Y
		//返回角度 /Math.atan()返回数字的反正切值
		return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
	},
	//删除事件
	delGoods(e) {
		const {
			item
		} = e.currentTarget.dataset
		console.log('item-->', item)
		wx.showModal({
			title: '温馨提示',
			content: '你确定要删除该商品吗？',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#99999',
			confirmText: '确定',
			// confirmColor: '#217BC9',
			success: async (e) => {
				if (e.cancel) {
					return
				}
				wx.utils.showLoading()
				const res = await wx.utils.Http.get({
					url: 'xxx',
					data: {}
				})
				wx.utils.hideLoading()
				if (res.code == 200) {
					wx.utils.Toast('删除成功')
					await this.getMyGoods()
				} else {
					wx.utils.Toast('删除失败，请重新尝试')
				}
			}
		})
	},
	onLoad(query) {
		this.setData({
			merId:query.merId
		})
	},
	async onShow() {
		this.getMyGoods()
	}
});
