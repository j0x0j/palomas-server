module.exports = {
  use: [
    'neutrino-preset-standard',
    'neutrino-preset-react',
    ['neutrino-middleware-html-template', {
      title: 'Palomas Mensajeras',
      mobile: true
    }],
    'neutrino-middleware-minify'
  ]
};
