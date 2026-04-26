# 📦 EAS Android Build Guide — LutongAI

## Prerequisites
- Node.js installed
- Expo account at https://expo.dev (free)
- Project dependencies installed (`npm install`)

---

## Step 1 — Install EAS CLI
```bash
npm install -g eas-cli
```

---

## Step 2 — Login to Expo
```bash
eas login
```
Enter your Expo account email and password.

---

## Step 3 — Configure EAS
Run this inside the `lutongAI` project folder:
```bash
eas build:configure
```
This generates an `eas.json` file. Replace its contents with:

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

- `preview` → builds an **APK** you can install directly on any Android device
- `production` → builds an **AAB** for uploading to Google Play Store

---

## Step 4 — Add Package Name to app.json
Open `app.json` and add `package` inside the `android` block:

```json
"android": {
  "package": "com.joemar.lutongai",
  "adaptiveIcon": {
    "backgroundColor": "#ffffff",
    "foregroundImage": "./assets/images/icon.png"
  },
  "edgeToEdgeEnabled": true,
  "predictiveBackGestureEnabled": false
}
```

> The package name must be unique. Format: `com.yourname.appname`

---

## Step 5 — Build APK (Preview)
```bash
eas build -p android --profile preview
```

- EAS will ask about the **keystore** — select **"Generate new keystore"** (EAS manages it for you)
- Build runs on Expo's cloud servers (~5–10 minutes)
- When done, you'll get a **download link** for the APK

---


## Step 6 — Install on Android Device
1. Download the `.apk` file from the link
2. Transfer to your Android device (USB or cloud)
3. On your device go to **Settings → Install unknown apps** and allow it
4. Open the APK file to install

---

## Step 7 — Production Build (Google Play)
```bash
eas build -p android --profile production
```
This produces an `.aab` file ready for Google Play Console upload.

---

## Useful Commands
| Command | Description |
|---|---|
| `eas build:list` | View all your builds |
| `eas build:cancel` | Cancel a running build |
| `eas whoami` | Check logged in account |

---

## Notes
- Free Expo account gets **30 builds/month**
- Your `.env` file with API keys is **not included** in the build by default — set them via `eas secret` or `app.config.js`
- Check build status anytime at https://expo.dev under your project

---

## Setting API Keys for Build
Since LutongAI uses a Gemini API key in `.env`, add it as an EAS secret:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value your_api_key_here
```
