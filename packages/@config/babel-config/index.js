/* eslint-env node */
module.exports = {
  plugins: ['@emotion'],
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ],
    '@babel/preset-typescript'
  ]
};
