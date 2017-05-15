const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const MODULES_PATH = path.resolve(__dirname, '../node_modules');

module.exports = () => {

  return {
    entry: {
      site: [
        './site/index',
      ],
    },
    output: {
      path: path.join(__dirname, '../docs'),
      filename: '[name].js',
      sourceMapFilename: '[name].js.map',
      publicPath: '/quark-ui/',
      // publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: 'file-loader',
        },
        {
          test: /\.md$/,
          use: 'raw-loader',
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  'env',
                  {
                    modules: false,
                  },
                ],
                'react',
                'stage-1',
              ],
              plugins: [
                'transform-decorators-legacy',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: '[hash:base64:7]',
                  minimize: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [
                    // values,
                    require('postcss-import'),
                    require('postcss-calc')(),
                    require('postcss-hsb-color')({
                      output: 'rgb',
                    }),
                    require('postcss-cssnext'),
                  ],
                },
              },
            ],
          }),
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    'env',
                    {
                      modules: false,
                    },
                  ],
                  'react',
                  'stage-1',
                ],
              },
            },
            {
              loader: 'react-svg-loader',
              options: {
                svgo: {
                  plugins: [
                    { cleanupIDs: false },
                  ],
                  floatPrecision: 3,
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        'quark-ui': path.resolve(__dirname, '../src/components/'),
      },
    },
    externals: {
      react: 'var React',
      'react-dom': 'var ReactDOM',
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      // SourceMap plugin will define process.env.NODE_ENV as development
      new webpack.SourceMapDevToolPlugin({
        columns: false,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: 'commons.js',
        // async: true,
      }),
      new ExtractTextPlugin({
        filename: 'style.css',
      }),
      new UglifyJSPlugin(),
      new HtmlWebpackPlugin({
        title: 'Quark UI',
        filename: 'index.html',
        template: './site/index.html',
        inject: 'head',
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer',
      }),
    ],
    devtool: 'cheap-source-map',
  };
};
