# Smart Gas Monitoring App (Firebase Realtime)

Production-ready React Native dashboard for a smart gas detection system with instant Firebase Realtime Database sync.

## Features

- Realtime gas value from `/sensor/gas`
- Realtime status from `/device/status` (`SAFE` / `DANGER`)
- Manual controls synced to Firebase:
	- `/controls/fan`
	- `/controls/buzzer`
	- `/controls/servo`
- Threshold control synced to Firebase:
	- `/controls/threshold`
	- Numeric input + slider (`1000` to `4000`)
- DANGER-first UX:
	- Red danger mode + `Gas Leak Detected` banner when backend status is `DANGER`
	- Green safe mode when backend status is `SAFE`
	- No local override of backend status

## Firebase Realtime Database Schema

```
/sensor/gas -> number
/device/status -> "SAFE" | "DANGER"

/controls/fan -> boolean
/controls/buzzer -> boolean
/controls/servo -> boolean
/controls/threshold -> number
```

## Folder Structure

```
src/
	components/
		ControlSwitch.js
		ThresholdControl.js
	hooks/
		useRealtimeData.js
	screens/
		DashboardScreen.js
	services/
		firebase.js
App.tsx
```

## Firebase Config Setup (Expo-style environment variables)

1. Copy values into `.env` (already generated in this project):

	 - `EXPO_PUBLIC_FIREBASE_API_KEY`
	 - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
	 - `EXPO_PUBLIC_FIREBASE_DATABASE_URL`
	 - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
	 - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
	 - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
	 - `EXPO_PUBLIC_FIREBASE_APP_ID`

2. Ensure your Firebase Realtime Database rules allow authenticated access suitable for your deployment model.

3. Create the required initial data nodes in Realtime Database:

	 - `/sensor/gas` (number)
	 - `/device/status` (`SAFE` or `DANGER`)
	 - `/controls/fan` (boolean)
	 - `/controls/buzzer` (boolean)
	 - `/controls/servo` (boolean)
	 - `/controls/threshold` (number between `1000` and `4000`)

## Run

Install dependencies and start Metro, then run on platform:

- `npm install`
- `npm start`
- `npm run android` (or `npm run ios`)

## Architecture Notes

- `src/services/firebase.js`
	- Contains all Firebase app initialization and DB read/write helpers.
	- Uses modular SDK (`firebase/app`, `firebase/database`).
- `src/hooks/useRealtimeData.js`
	- Uses `onValue` listeners for all required paths.
	- Maintains loading + error state.
	- No polling.
- `src/components/ControlSwitch.js`
	- Reusable toggle UI component.
- `src/components/ThresholdControl.js`
	- Reusable slider + numeric input component.
	- Writes threshold instantly to Firebase.

## Production Considerations

- Keep `.env` out of source control (`.gitignore` already configured).
- Restrict Firebase DB security rules before release.
- Add crash reporting/analytics and E2E tests for deployment pipelines.
