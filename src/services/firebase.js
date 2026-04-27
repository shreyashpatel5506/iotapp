import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';

const MIN_THRESHOLD = 1000;
const MAX_THRESHOLD = 4000;

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const database = getDatabase(app);

const refs = {
  gas: ref(database, '/sensor/gas'),
  status: ref(database, '/device/status'),
  fan: ref(database, '/controls/fan'),
  buzzer: ref(database, '/controls/buzzer'),
  servo: ref(database, '/controls/servo'),
  threshold: ref(database, '/controls/threshold'),
};

function listenWithFallback(reference, mapValue, fallbackValue, onChange) {
  return onValue(reference, snapshot => {
    const raw = snapshot.val();
    const parsed = mapValue(raw);
    onChange(parsed ?? fallbackValue);
  });
}

export function clampThreshold(value) {
  const parsed = Number.parseInt(String(value), 10);

  if (!Number.isFinite(parsed)) {
    return MIN_THRESHOLD;
  }

  return Math.max(MIN_THRESHOLD, Math.min(MAX_THRESHOLD, parsed));
}

export function subscribeToGas(onChange) {
  return listenWithFallback(refs.gas, value => Number(value), 0, onChange);
}

export function subscribeToStatus(onChange) {
  return listenWithFallback(
    refs.status,
    value => (value === 'DANGER' ? 'DANGER' : 'SAFE'),
    'SAFE',
    onChange,
  );
}

export function subscribeToFan(onChange) {
  return listenWithFallback(refs.fan, value => Boolean(value), false, onChange);
}

export function subscribeToBuzzer(onChange) {
  return listenWithFallback(
    refs.buzzer,
    value => Boolean(value),
    false,
    onChange,
  );
}

export function subscribeToServo(onChange) {
  return listenWithFallback(
    refs.servo,
    value => Boolean(value),
    false,
    onChange,
  );
}

export function subscribeToThreshold(onChange) {
  return listenWithFallback(
    refs.threshold,
    value => clampThreshold(value),
    1800,
    onChange,
  );
}

export function updateControlSwitch(name, enabled) {
  if (!refs[name]) {
    throw new Error(`Unsupported control: ${name}`);
  }

  return set(refs[name], Boolean(enabled));
}

export function updateThreshold(value) {
  return set(refs.threshold, clampThreshold(value));
}
