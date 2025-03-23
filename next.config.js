/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Add resolve fallbacks for React 19 compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
    };
    
    // Work around valtio and other packages expecting earlier React versions
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'use-sync-external-store/shim': require.resolve('use-sync-external-store/shim'),
      'use-sync-external-store/shim/with-selector': require.resolve('use-sync-external-store/shim/with-selector'),
    };
    
    return config;
  },
};

module.exports = nextConfig; 