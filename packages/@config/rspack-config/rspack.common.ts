<<<<<<< HEAD
=======
import * as path from 'node:path';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
>>>>>>> 6f3fd25 ([sc-72] project fix first render issue (#22))
import * as rspack from '@rspack/core';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'node:path';
import InjectGoogleFontsPlugin from './plugins/google-fonts-plugin';

const getCommonConfig = (): rspack.Configuration => {
  const prod = process.env.NODE_ENV === 'production';
  const dev = !prod;
  return {
    entry: './src/main',
    output: {
      path: path.join(process.cwd(), 'dist'),
      chunkFilename: '[id].[contenthash].js',
      publicPath: 'auto'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      tsConfig: {
        configFile: path.resolve(__dirname, '../tsconfig/tsconfig.json')
      }
    },
    // Ensure loaders referenced here are resolvable when this config is consumed from other packages
    resolveLoader: {
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
    },
    module: {
      rules: [
        {
          test: /\.(j|t)s$/,
          exclude: [/[\\/]node_modules[\\/]/],
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript'
              },
              externalHelpers: true,
              transform: {
                react: {
                  runtime: 'automatic',
                  development: dev,
                  refresh: dev
                }
              }
            },
            env: {
              targets: 'Chrome >= 48'
            }
          }
        },
        {
          test: /\.(j|t)sx$/,
          loader: 'builtin:swc-loader',
          exclude: [/[\\/]node_modules[\\/]/],
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: dev,
                  refresh: dev
                }
              },
              externalHelpers: true
            },
            env: {
              targets: 'Chrome >= 48' // browser compatibility
            }
          }
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
          test: /\.css$/i,
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
      new rspack.ProvidePlugin({
        React: 'react'
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        publicPath: '/',
        favicon: './public/favicon.png'
      }),
      new InjectGoogleFontsPlugin(),
      // Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
      process.env.RSDOCTOR &&
        new RsdoctorRspackPlugin({
          // plugin options
        })
    ].filter(Boolean)
  };
};

export default getCommonConfig;
