module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true
      }
    }
  },
  {
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  },
  {
    test: /\.(png|jpe?g|gif|ttf|woff2?|eot|otf)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
            name: '[path][name].[ext]',
            publicPath: '../.', // move up from 'main_window'
            context: 'src', // set relative working folder to src
        },
      },
    ],
  }
];
