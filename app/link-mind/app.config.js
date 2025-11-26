import 'dotenv/config';


export default {
  expo: {
    name: "link-mind",
    slug: "link-mind",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "linkmind",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#09090B"
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIStatusBarStyle: "UIStatusBarStyleDarkContent"
      },
      bundleIdentifier: "com.anonymous.linkmind"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#09090B"
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.linkmind",
      googleServicesFile: "./google-services.json"
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      }
    },
    owner: "vitorribeiro5623",
    experiments: {
      typedRoutes: true
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "expo-font",
      "expo-web-browser"
    ],
  }
};