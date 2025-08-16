import 'dotenv/config'

export default ({ config }) => ({
  expo: {
    name: 'Mama Fit',
    slug: 'mamafit-mobile',
    version: '1.0.8',
    orientation: 'portrait',
    icon: './assets/images/mamafit-app-icon.png',
    scheme: 'mamafit',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/mamafit-app-icon.png',
        backgroundColor: '#ffffff'
      },
      edgeToEdgeEnabled: true,
      package: 'com.mamafit.app',
      googleServicesFile: './google-services.json',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'mamafit.studio',
              pathPrefix: '/'
            },
            {
              scheme: 'mamafit',
              host: '*',
              pathPrefix: '/'
            }
          ],
          category: ['BROWSABLE', 'DEFAULT']
        }
      ]
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-video',
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true
        }
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/mamafit-splash-screen.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ],
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/Inter-Light.ttf',
            './assets/fonts/Inter-Regular.ttf',
            './assets/fonts/Inter-Medium.ttf',
            './assets/fonts/Inter-SemiBold.ttf',
            './assets/fonts/Inter-Bold.ttf',
            './assets/fonts/Inter-ExtraBold.ttf'
          ]
        }
      ],
      'expo-secure-store',
      '@react-native-google-signin/google-signin',
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      'expo-web-browser'
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: '4316a3bf-866d-43bb-b53f-b07bc0c013fc'
      }
    },
    owner: 'mamafit',
    runtimeVersion: {
      policy: 'appVersion'
    },
    updates: {
      url: 'https://u.expo.dev/4316a3bf-866d-43bb-b53f-b07bc0c013fc'
    }
  }
})
