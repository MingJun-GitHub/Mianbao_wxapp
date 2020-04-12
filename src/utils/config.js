// 配置文件
const config = {
    // 开发环境
	development: {
		wxappId: 'wx8656468c3d8f3889',
		baseUrl: 'http://139.199.79.220:8102/saleapi'
    },
    // 生产
	production: {
		wxappId: 'wx8656468c3d8f3889',
		baseUrl: 'https://shop.gtqad.com/saleapi'
	}
} // [process.env.NODE_ENV]
export default config[process.env.NODE_ENV || 'development']