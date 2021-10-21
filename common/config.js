const CONFIG = {
	// 开发环境配置
	development: {
		baseUrl: '/dev',
	},
	// 生产环境配置
	production: {
		baseUrl: '/pre',
	}
}
export default CONFIG[process.env.NODE_ENV];
