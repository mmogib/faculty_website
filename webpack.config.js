const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

module.exports = [
	{
		entry: ['babel-polyfill', './index'],
		output: {
			filename: 'bundle.min.js',
			path: path.resolve(__dirname, 'assets/js')
		},
		module: {
			loaders: [
				{
					test: /\.css$/,
					loader: ['style-loader', 'css-loader']
				},
				{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
				{
					test: /\.(png|svg|jpg|gif)$/,
					use: {
						loader: 'file-loader'
						/*options: {
							name(file) {
									return '[name].[ext]'
								//'[hash].[ext]'
							}
						}*/
					}
				}
			]
		},
		plugins: [
			new UglifyJSPlugin(),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			})
		],
		devServer: {
			contentBase: path.join(__dirname, 'public'),
			compress: true,
			port: 9000
		}
	}
]
