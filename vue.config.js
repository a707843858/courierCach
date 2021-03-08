const glob = require('glob');
// const TerserPlugin = require('terser-webpack-plugin');
// 配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
	const entries = {};
	let tmp;

	// 读取src/pages/**/底下所有的html文件
	glob.sync(`${globPath}html`).forEach(function(iPath) {
		tmp = iPath.split('/').splice(-3);
		entries[tmp[1]] = {
			entry: iPath.replace(`/${tmp[1]}.html`, `/${tmp[1]}.ts`),
			template: iPath,
			filename: `${tmp[1]}.html`,
		};
	});
	return entries;
}
const pages = getEntry('./src/pages/**/*.');
// console.log(pages,'pages');

module.exports = {
	publicPath: './',
	outputDir: 'dist', //打包时生成的生产环境构建文件的目录
	assetsDir: 'public', //放置生成的静态资源(s、css、img、fonts)的(相对于 outputDir 的)目录(默认'')
	indexPath: 'index.html', //指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
	lintOnSave: false, // 是否在保存的时候检查
	devServer: {
		port: 80,
		host: '0.0.0.0',
		open: true,
		index: '/index.html',
		overlay: {
			warnings: false,
			errors: false,
		},
		// proxy: {},
	},
	pages,
	productionSourceMap: false,
	// configureWebpack: (config) => {
	// 	if (process.env.NODE_ENV === 'production') {
	// 		config.plugins.push(new TerserPlugin());
	// 		config.optimization.minimizer[0].options.terserOptions.compress.warnings = false; //去掉警告
	// 		config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true; //去掉console
	// 		config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true; //去掉debugger
	// 		config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
	// 	}
	// },
};
