import path from 'path';

module.exports = {
	target: 'web',
    entry: {
        libraries: './src/index.ts'
    },
    output: {
        path:          path.join(__dirname, 'radiko-program-list.widget', 'lib'),
        filename:      '[name].bundle.js',
        library:       '[name]',
        libraryTarget: 'umd'
    },
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [{
			test:    /\.ts$/,
			use: [{
				loader: 'ts-loader',
			}]
		}]
	}
};
