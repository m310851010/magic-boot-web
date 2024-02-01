const PROXY_CONFIG = [
  {
    context: ['/ma-boot-api/'],
    target: 'http://localhost:8090',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug'
  }
];

module.exports = PROXY_CONFIG;
