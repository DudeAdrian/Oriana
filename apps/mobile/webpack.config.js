const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // 1. Force the compilation entry block directly to the local App.js file layout
  config.entry = [
    path.resolve(__dirname, 'App.js')
  ];
  
  // 2. Map the structural aliasing so native styles compile to web HTML cleanly
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };
  
  return config;
};