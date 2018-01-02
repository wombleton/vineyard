const pkg = require('./package.json')
const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')

// replace localhost with 0.0.0.0 if you want to access
// your app from wifi or a virtual machine
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000
const sourcePath = path.join(__dirname, './src')
const buildDirectory = path.join(__dirname, './build')

const stats = {
  assets: true,
  children: false,
  chunks: false,
  hash: false,
  modules: false,
  publicPath: false,
  timings: true,
  version: false,
  warnings: true,
  colors: {
    green: '\u001b[32m',
  },
}

module.exports = function(env) {
  const nodeEnv = env && env.prod ? 'production' : 'development'
  const isProd = nodeEnv === 'production'

  const htmlTemplate = isProd ? 'index.prod.ejs' : 'index.dev.ejs'

  const cssLoader = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          module: true, // css-loader 0.14.5 compatible
          modules: true,
          localIdentName: '[hash:base64:5]',
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'collapsed',
          sourceMap: true,
          includePaths: [sourcePath],
        },
      },
    ],
  })

  const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
    }),

    // setting production environment will strip out
    // some of the development code from the app
    // and libraries
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
    }),

    // create css bundle
    new ExtractTextPlugin(isProd ? 'tb-[hash].css' : 'tb.css'),

    // create index.html
    new HtmlWebpackPlugin({
      filename: isProd ? 'tb.html' : 'index.html',
      template: htmlTemplate,
      inject: true,
      production: isProd,
      minify: isProd && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    // preload chunks
    new PreloadWebpackPlugin(),
  ]

  if (isProd) {
    plugins.push(
      // minify remove some of the dead code
      new BabiliPlugin()
    )
  } else {
    plugins.push(
      // make hot reloading work
      new webpack.HotModuleReplacementPlugin(),
      // show module names instead of numbers in webpack stats
      new webpack.NamedModulesPlugin(),
      // don't spit out any errors in compiled assets
      new webpack.NoEmitOnErrorsPlugin()
    )
  }

  const entryPoint = isProd
    ? './index.js'
    : [
        // activate HMR for React
        'react-hot-loader/patch',

        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        `webpack-dev-server/client?http://${host}:${port}`,

        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        'webpack/hot/only-dev-server',

        // the entry point of our app
        './index.js',
      ]

  return {
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    context: sourcePath,
    entry: {
      tb: entryPoint,
      vendor: Object.keys(pkg.dependencies),
    },
    output: {
      path: buildDirectory,
      publicPath: isProd
        ? 'https://storage.googleapis.com/hap-static/'
        : 'http://localhost:3000/',
      filename: isProd ? '[name]-[hash].js' : '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
    },
    module: {
      rules: [
        {
          test: /\.(html|jpe?g|png|ttf|woff2?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'static/[name]-[hash].[ext]',
            },
          },
        },
        {
          test: /\.svg$/,
          use: ['svg-sprite-loader', 'image-webpack-loader'],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: cssLoader,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
      ],
    },
    resolve: {
      extensions: [
        '.webpack-loader.js',
        '.web-loader.js',
        '.loader.js',
        '.js',
        '.jsx',
      ],
      modules: [path.resolve(__dirname, 'node_modules'), sourcePath],
    },

    plugins,

    performance: isProd && {
      maxAssetSize: 300000,
      maxEntrypointSize: 300000,
      hints: 'warning',
    },

    stats: stats,

    devServer: {
      contentBase: './src',
      publicPath: '/',
      historyApiFallback: true,
      port: port,
      host: host,
      hot: !isProd,
      compress: isProd,
      stats: stats,
    },
  }
}
