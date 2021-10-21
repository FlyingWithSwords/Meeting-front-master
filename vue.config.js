const TransformPages = require('uni-read-pages')
const {webpack} = new TransformPages()
module.exports = {
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'meta','aliasPath']
					});
					return JSON.stringify(tfPages.routes)
				}, true )
			})
		]
	},
	
 /* 	publicPath: './',
	  devServer: {
	    proxy: {
	      '/api': {
	        target: 'http://h2h95m.natappfree.cc',
	        ws: true,
	        changeOrigin: true,
	        pathRewrite: {
	          '^/api': ''
	        }
	      },
	      '/bpi': {
	        target: 'http://h2h95m.natappfree.cc',
	        ws: true,
	        changeOrigin: true,
	        pathRewrite: {
	          '^/bpi': ''
	        }
	      }
	    }
	  },
	  pwa: {
	    iconPaths: {
	      favicon32: 'favicon.ico',
	      favicon16: 'favicon.ico',
	      appleTouchIcon: 'favicon.ico',
	      maskIcon: 'favicon.ico',
	      msTileImage: 'favicon.ico'
	    }
	  } */
}