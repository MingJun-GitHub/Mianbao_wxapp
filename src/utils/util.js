function formatNumber(n) {
	n = n.toString();
	return n[1] ? n : '0' + n;
}

export function formatTime(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return (
		[year, month, day].map(formatNumber).join('/') +
		' ' + [hour, minute, second].map(formatNumber).join(':')
	);
}

export function dateFtt(fmt, date) { //author: meizz   
	var o = {
		"M+": date.getMonth() + 1, //月份   
		"d+": date.getDate(), //日   
		"h+": date.getHours(), //小时   
		"m+": date.getMinutes(), //分   
		"s+": date.getSeconds(), //秒   
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
		"S": date.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/**
 * 
 * @param {* api } api 
 * promis化
 */
export function promisify(api) {
	return (options, ...params) => {
		return new Promise((resolve) => {
			api(Object.assign({}, options, {
				success: resolve,
				fail: resolve
			}), ...params);
		});
	}
}

export function debounce(fn, wait) {
	var timeout = null;
	return function () {
		if (timeout !== null) clearTimeout(timeout)
		timeout = setTimeout(fn, wait)
	}
}

export function goPage(e) {
	let {
		name,
		params,
		login
	} = e.currentTarget.dataset
	if (login && !wx.utils.Login.isBindPhone) {
		wx.navigateTo({
			url: '/pages/login/index'
		})
		return
	}
	params = params ? `?${params}` : ''
	const url = `/pages/${name}/index${params}`
	console.log('跳转的链接', url)
	wx.navigateTo({
		url
	})

}
