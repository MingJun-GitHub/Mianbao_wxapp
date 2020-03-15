// 配置文件
const config = {
    // 开发环境
	development: {
		wxappId: 'wxd43f3498112f6565',
		baseUrl: 'http://47.112.107.132:8101/shopapi'
    },
    // 生产
	production: {
		wxappId: 'wxd43f3498112f6565',
		baseUrl: 'https://wap.suxianfood.com/shopapi'
	}
} // [process.env.NODE_ENV]
export default config[process.env.NODE_ENV || 'development']