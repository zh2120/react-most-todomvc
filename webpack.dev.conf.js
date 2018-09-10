const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')

const resolve = dir => path.join(__dirname, dir)

const config = {
  devtool: 'inline-source-map',
  entry: ['react-hot-loader/patch', './src/index.js'],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.jsx?$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          // {
          //   loader: 'sass-loader'
          // }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ],
    unsafeCache: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [resolve('src'), resolve('node_modules')],
    alias: {
      src: resolve('src')
    }
  },
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
    pathinfo: true
  },
  plugins: [
    new WebpackBar({
      name: '',
      color: 'green',
      profile: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendor',
          reuseExistingChunk: false,
          priority: -10
        },
        'async-vendors': {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          chunks: 'async',
          name: 'async-vendors',
          priority: -20
        }
      }
    },
    runtimeChunk: { name: 'runtime' },
    noEmitOnErrors: true,
    mergeDuplicateChunks: true,
    removeEmptyChunks: true,
    removeAvailableModules: true,
    namedModules: true,
    namedChunks: true,
    providedExports: true
  },
  cache: true,
  devServer: {
    hot: true,
    compress: true,
    contentBase: resolve('dist'),
    open: true,
    inline: true,
    overlay: true,
    stats: 'errors-only',
    port: 8080
  }
}

module.exports = config
