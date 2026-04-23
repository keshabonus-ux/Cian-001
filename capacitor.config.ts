import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "tm.jay.app",
  appName: "Jay.tm",
  webDir: "out",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
    iosScheme: "https",
    cleartext: false,
  },
  ios: {
    contentInset: "always",
    backgroundColor: "#0b1220",
  },
  android: {
    backgroundColor: "#0b1220",
    allowMixedContent: false,
  },
};

export default config;
