const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

const mfeConfig = withModuleFederationPlugin({

  name : 'smart_tablev1',

  exposes: {
    './EngineerSmartprioritization': './src/app/components/engineer-smartprioritization/engineer-smartprioritization',

    './EngineerDetail': './src/app/components/engineer-detail/engineer-detail',
    
    './EngineerDetailById': './src/app/components/engineer-detail-by-id/engineer-detail-by-id',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),
  },
});

// 2. Ekspor konfigurasi dengan menggabungkan watchOptions di tingkat paling atas
module.exports = {
  ...mfeConfig,
  watchOptions: {
    ignored: ["**/node_modules/**", "**/.angular/**", "**/dist/**"]
  }
};