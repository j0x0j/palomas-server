module.exports = {
  use: [
    'neutrino-preset-standard',
    'neutrino-preset-react',
    'neutrino-middleware-style-loader',
    ['neutrino-middleware-env', ['SERVER_ADDR']],
    'neutrino-middleware-minify',
    ['neutrino-middleware-html-template', {
      title: 'Palomas Mensajeras',
      mobile: true
    }]
  ]
};
