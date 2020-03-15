// request
import config from './config'

import {
	promisify
}
from './util'


class Http {
	// 初始化
	constructor() {
		this.baseUrl = config.baseUrl
		this.params = {
				method: 'POST',
				header: {
					// x-www-form-urlencoded
					'content-type': 'application/json'
				}
			},
			this.requestCommon = promisify(wx.request)
		this.uploadCommon = promisify(wx.uploadFile)
	}
	async get(params) {
		const res = await this.request(Object.assign(params, {
			method: 'GET'
		}))
		return res
	}
	async post(params) {
		const res = await this.request(Object.assign(params, {
			method: 'POST'
		}))
		return res
	}
	async request(params) {
		const res = await this.requestCommon(this.dealParams(params))
		console.log('<--logs-->', this.params, res)
		return this.returnData(res)
	}
	// 上传工具
	async uploadFile(params) {
		params.url = this.baseUrl + '/upload/attachUpload'
		params.name = params.name ? params.name : 'file'
		const res = await this.uploadCommon(params)
		return this.returnData(res)
	}
	dealParams(params) {
		this.params.header.token = wx.utils.Login.toekn || wx.getStorageSync('loginInfo').token || ''
		params = Object.assign({
			...this.params
		}, params)
		// console.log('params--->', params)
		if (!/^http(s)?:\/\/.+/.test(params.url)) {
			params.url = this.baseUrl + params.url
		}
		if (params.method) {
			params.method = params.method.toUpperCase()
		} else {
			params.method = 'POST'
		}
		return params
	}
	returnData(res) {
		if (this.repSetting) {
			return res
		} else {
			return res.data || res.object
		}
	}
}

export default new Http()
