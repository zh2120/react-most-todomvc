const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const config = {
  devtool: false,
  entry: {
    app: './src/index.js'
  },
  module: {
    rules: [
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
            loader: MiniCssExtractPlugin.loader
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
    ]
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
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new WebpackBar({
      name: '',
      color: 'green',
      profile: true
    }),
    new MiniCssExtractPlugin({
      path: resolve('dist'),
      publicPath: '/',
      filename: 'css/[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      filename: resolve('dist/index.html'),
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new BundleAnalyzerPlugin()
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
    noEmitOnErrors: true
  },
  performance: {
    hints: false
  }
}

module.exports = config
