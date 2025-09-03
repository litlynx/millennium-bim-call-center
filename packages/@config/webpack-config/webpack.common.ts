import * as path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as webpack from 'webpack';
import InjectGoogleFontsPlugin from './plugins/google-fonts-plugin';

const getCommonConfig = (): webpack.Configuration => ({
  entry: './src/main',
  output: {
    path: path.join(process.cwd(), 'dist'),
    chunkFilename: '[id].[contenthash].js',
    publicPath: 'auto'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  // Ensure loaders referenced here are resolvable when this config is consumed from other packages
  resolveLoader: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // CSS Modules (files ending with .module.css)
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              },
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              // Use the shared package's postcss.config.js for all apps
              postcssOptions: {
                config: path.resolve(__dirname, '../../shared/postcss.config.js')
              }
            }
          }
        ]
      },
      // Regular CSS files (including Tailwind)
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              // Use the shared package's postcss.config.js for all apps
              postcssOptions: {
                config: path.resolve(__dirname, '../../shared/postcss.config.js')
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|svg)/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      publicPath: '/',
      favicon: './public/favicon.png'
    }),
    new InjectGoogleFontsPlugin()
  ]
});

export default getCommonConfig;
