const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	resolve: {
		extensions: ['.js', '.ts', '.json'],
	},
	// devtool: 'source-map', // 打包出的js文件是否生成map文件（方便浏览器调试）
	// mode: 'production',
	entry: {
		index: './src/index.ts',
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.js', '.tsx'],
	},
	devServer: {
		//本地调试服务配置
		port: 80, //端口
		host: '0.0.0.0', //局域网访问可填写'0.0.0.0'
		hot: true, //启动热更新
		filename: 'bundle.js', //入口文件引入
		contentBase: path.join(__dirname, 'src'), //映射资源目录位置
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:3000',
				secure: false,
			},
		},
		overlay: true,
	},
	module: {
		rules: [
			// {
			// 	test: /\.js$/,
			// 	exclude: /(node_modules|bower_components)/,
			// 	use: {
			// 		loader: 'babel-loader',
			// 		options: {
			// 			presets: [
			// 				[
			// 					'@babel/preset-env',
			// 					{
			// 						useBuiltIns: 'entry',
			// 					},
			// 				],
			// 			],
			// 			plugins: ['@babel/plugin-transform-runtime'],
			// 		},
			// 	},
			// },
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [new CleanWebpackPlugin()],
};
