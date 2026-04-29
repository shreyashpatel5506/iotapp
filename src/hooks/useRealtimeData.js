import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  clampThreshold,
  subscribeToDevice,
  subscribeToControls,
  subscribeToGas,
  subscribeToAlerts,
  subscribeToConnection,
  updateControlSwitch,
  updateThreshold,
} from '../services/firebase';

const INITIAL_DATA = {
  gas: 0,
  status: 'SAFE',
  isConnected: false,
  controls: {
    fan: false,
    buzzer: false,
    servo: false,
    threshold: 3113,
  },
  device: {
    buzzer: false,
    fan: false,
    gasLevel: 0,
    manualOverride: false,
    servo: false,
    servoAngle: 0,
    status: 'SAFE',
  },
  alerts: {
    lastAlert: '',
  }
};

export function useRealtimeData() {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const lastAlertRef = useRef('');
  const isFirstLoadAlert = useRef(true);

  useEffect(() => {
    const unsubscribers = [
      subscribeToGas(value => {
        setData(current => ({ 
          ...current, 
          gas: value,
          device: { ...current.device, gasLevel: value } 
        }));
        setLoading(false);
      }),
      subscribeToDevice(deviceData => {
        setData(current => ({
          ...current,
          status: deviceData?.status || current.status,
          device: { ...current.device, ...deviceData }
        }));
      }),
      subscribeToConnection(isConnected => {
        setData(current => ({
          ...current,
          isConnected
        }));
      }),

      subscribeToControls(controlsData => {
        setData(current => ({
          ...current,
          controls: { ...current.controls, ...controlsData }
        }));
      }),
      subscribeToAlerts(alertsData => {
        const lastAlert = alertsData?.lastAlert || '';
        setData(current => ({
          ...current,
          alerts: { ...current.alerts, ...alertsData }
        }));

        if (isFirstLoadAlert.current) {
          lastAlertRef.current = lastAlert;
          isFirstLoadAlert.current = false;
        } else if (lastAlert && lastAlert !== lastAlertRef.current) {
          lastAlertRef.current = lastAlert;
          // Trigger push notification (simulated via Alert.alert)
          Alert.alert('🚨 Gas System Alert', lastAlert);
        }
      }),

    ];

    return () => {
      unsubscribers.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, []);

  const actions = useMemo(
    () => ({
      setThreshold: async value => {
        try {
          const safeValue = clampThreshold(value);
          await updateThreshold(safeValue);
          setError('');
        } catch (e) {
          setError('Failed to update threshold. Check your connection.');
        }
      },
      setControl: async (name, enabled) => {
        try {
          await updateControlSwitch(name, enabled);
          setError('');
        } catch (e) {
          setError(`Failed to update ${name}. Check your connection.`);
        }
      },
    }),
    [],
  );

  return { data, loading, error, actions };
}

