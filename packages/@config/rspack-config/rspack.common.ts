import * as path from 'node:path';
import type { Configuration as RspackConfiguration } from '@rspack/core';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// Note: We will keep tsconfig paths via alias in the consuming projects to avoid plugin incompat issues.

const getCommonConfig = (): RspackConfiguration => ({
  entry: './src/main',
  output: {
    path: path.join(process.cwd(), 'dist'),
    chunkFilename: '[id].[contenthash].js',
    publicPath: 'auto'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // Use built-in SWC for TS/TSX for speed. If Babel-only features are needed, we'll add babel-loader later.
        type: 'javascript/auto'
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: { localIdentName: '[name]__[local]__[hash:base64:5]' },
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // reference shared postcss config from monorepo
                config: path.resolve(__dirname, '../../shared/postcss.config.js')
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '../../shared/postcss.config.js')
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      publicPath: '/',
      favicon: './public/favicon.png'
    }),
    new CopyPlugin({ patterns: [] })
  ]
});

export default getCommonConfig;
