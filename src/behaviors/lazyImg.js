// 利用Behavior来试着做一个图片懒加载
module.exports = Behavior({
    behaviors: [],
    data: {
      myBehaviorData: {}
    },
    // 试一下全局加图片懒加载
	onPageScroll(e) {
		console.log('距离顶部', e.scrollTop)
	},
})