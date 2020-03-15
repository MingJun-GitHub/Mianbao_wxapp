


import {promisify}  from './util'


function Toast(title, duration = 2000) {
	wx.showToast({
		title,
		mask: false,
		icon: 'none',
		duration
	})
}

function Loading(title = '请稍后...', mask = false) {
	wx.showLoading({
		title,
		mask
	})
}

var baseObj = {}
var promisifyArr = ['showLoading', 'hideLoading']
promisifyArr.forEach(item => {
	baseObj[item] = promisify(wx[item])
})

export default {
    Toast,
    Loading,
    ...baseObj
}





