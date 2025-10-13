import type * as rspack from '@rspack/core';
import type { HtmlTagObject } from 'html-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Compilation } from 'webpack';

export default class InjectGoogleFontsPlugin {
  private href =
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap';

  apply(compiler: rspack.Compiler) {
    compiler.hooks.compilation.tap('InjectGoogleFontsPlugin', (compilation) => {
      const hooks = (HtmlWebpackPlugin as typeof HtmlWebpackPlugin).getHooks(
        compilation as unknown as Compilation
      );

      hooks.alterAssetTagGroups.tap(
        'InjectGoogleFontsPlugin',
        (data: {
          headTags: HtmlTagObject[];
          bodyTags: HtmlTagObject[];
          outputName: string;
          publicPath: string;
          plugin: HtmlWebpackPlugin;
        }) => {
          const preconnect1 = {
            tagName: 'link',
            voidTag: true,
            meta: {},
            attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
          };
          const preconnect2 = {
            tagName: 'link',
            voidTag: true,
            meta: {},
            attributes: {
              rel: 'preconnect',
              href: 'https://fonts.gstatic.com',
              crossorigin: ''
            }
          };
          const preload = {
            tagName: 'link',
            voidTag: true,
            meta: {},
            attributes: { rel: 'preload', as: 'style', href: this.href }
          };
          const stylesheet = {
            tagName: 'link',
            voidTag: true,
            meta: {},
            attributes: {
              rel: 'stylesheet',
              href: this.href,
              media: 'print',
              onload: "this.media='all'"
            }
          };

          data.headTags = [preconnect1, preconnect2, preload, stylesheet, ...data.headTags];
          return data;
        }
      );

      // Inject <noscript> fallback right before </head>
      hooks.beforeEmit.tap(
        'InjectGoogleFontsPlugin',
        (data: { html: string; outputName: string; plugin: HtmlWebpackPlugin }) => {
          const noscript = `<noscript><link rel="stylesheet" href="${this.href}"/></noscript>`;
          if (!data.html.includes(noscript)) {
            data.html = data.html.replace('</head>', `${noscript}\n</head>`);
          }
          return data;
        }
      );
    });
  }
}
