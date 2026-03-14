/**
 * app.config.js
 *
 * EAS-specific config (runtimeVersion, updates) is only applied during
 * EAS builds. When running with Expo Go (local dev), those fields are
 * omitted so Expo Go's own runtime version is used — preventing the
 * "Runtime version mismatch" error that blocks Expo Go.
 *
 * To run locally:  npx expo start
 * To build:        eas build --profile preview
 */
const IS_EAS = !!process.env.EAS_BUILD

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'Brew Loyalty',
  slug: 'brew-loyalty',
  owner: 'jensendp',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  scheme: 'brewloyalty',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.brewloyalty.app',
  },
  android: {
    package: 'com.brewloyalty.app',
    adaptiveIcon: {
      backgroundColor: '#ffffff',
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? '',
    },
  },
  // Only set runtimeVersion and updates when building with EAS.
  // Expo Go uses its own sdkVersion-based runtime — setting a custom
  // runtimeVersion here causes a version mismatch that blocks Expo Go.
  ...(IS_EAS && {
    runtimeVersion: { policy: 'appVersion' },
    updates: {
      url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID ?? ''}`,
      enabled: true,
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 0,
    },
  }),
}

module.exports = config
