import { create } from 'zustand';
import { db } from '../services/firebase';
import { initMessaging } from '../services/notifications';

const DEFAULT_DEVICE = {
  gasLevel: 0,
  status: 'SAFE',
  fan: false,
  buzzer: false,
  servo: false,
  servoAngle: 0,
  lastAlert: 'No alerts',
  state: 'NORMAL'
};

export const useIoTStore = create((set, get) => ({
  device: DEFAULT_DEVICE,
  settings: {
    notificationsEnabled: true,
    threshold: 1800,
  },
  isConnected: false,

  initListeners: () => {
    // Connection State
    const connectedRef = db.ref('.info/connected');
    connectedRef.on('value', snap => {
      set({ isConnected: snap.val() === true });
    });

    // Device Status
    db.ref('/device/status').on('value', snap => {
      const val = snap.val() || 'SAFE';
      set(state => ({ 
        device: { 
          ...state.device, 
          status: val, 
          state: val === 'DANGER' ? 'GAS_DETECTED' : 'NORMAL' 
        } 
      }));
    });
    
    // Gas Level
    db.ref('/sensor/gas').on('value', snap => {
      set(state => ({ 
        device: { ...state.device, gasLevel: Number(snap.val() || 0) } 
      }));
    });

    // Fan State
    db.ref('/device/fan').on('value', snap => {
      set(state => ({ 
        device: { ...state.device, fan: Boolean(snap.val() || false) } 
      }));
    });

    // Buzzer State
    db.ref('/device/buzzer').on('value', snap => {
      set(state => ({ 
        device: { ...state.device, buzzer: Boolean(snap.val() || false) } 
      }));
    });

    // Servo State
    db.ref('/device/servo').on('value', snap => {
      set(state => ({ 
        device: { ...state.device, servo: Boolean(snap.val() || false) } 
      }));
    });

    // Servo Angle
    db.ref('/device/servoAngle').on('value', snap => {
      set(state => ({ 
        device: { ...state.device, servoAngle: Number(snap.val() || 0) } 
      }));
    });

    // Last Alert
    db.ref('/alerts/lastAlert').on('value', snap => {
      set(state => ({ 
        device: { ...state.device, lastAlert: snap.val() || 'No active alerts' } 
      }));
    });
  },

  initNotifications: async () => {
    try {
      await initMessaging();
    } catch (e) {
      console.error('Failed to initialize notifications', e);
    }
  },

  updateDeviceToggle: async (key, value) => {
    try {
      if (['fan', 'buzzer', 'servo'].includes(key)) {
        await db.ref(`/controls/${key}`).set(value);
      }
    } catch (e) {
      console.error(`Failed to update toggle: ${key}`, e);
    }
  },

  triggerReset: async () => {
    try {
      await db.ref('/controls/reset').set(true);
    } catch (e) {
      console.error('Failed to trigger reset', e);
    }
  },

  updateSettings: async newSettings => {
    try {
      set(state => ({
        settings: { ...state.settings, ...newSettings }
      }));
    } catch (e) {
      console.error('Failed to update settings', e);
    }
  },
}));
