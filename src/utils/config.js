// 配置文件
const config = {
    // 开发环境
	development: {
		wxappId: 'wxd43f3498112f6565',
		baseUrl: 'http://139.199.79.220:8102/saleapi'
    },
    // 生产
	production: {
		wxappId: 'wxd43f3498112f6565',
		baseUrl: 'https://wap.suxianfood.com/shopapi'
	}
} // [process.env.NODE_ENV]
export default config[process.env.NODE_ENV || 'development']