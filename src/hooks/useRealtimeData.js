import { useEffect, useMemo, useRef, useState } from 'react';
import {
  clampThreshold,
  subscribeToBuzzer,
  subscribeToFan,
  subscribeToGas,
  subscribeToServo,
  subscribeToStatus,
  subscribeToThreshold,
  updateControlSwitch,
  updateThreshold,
} from '../services/firebase';

const INITIAL_DATA = {
  gas: 0,
  status: 'SAFE',
  controls: {
    fan: false,
    buzzer: false,
    servo: false,
    threshold: 1800,
  },
};

const REQUIRED_KEYS = ['gas', 'status', 'fan', 'buzzer', 'servo', 'threshold'];

export function useRealtimeData() {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hydratedKeysRef = useRef(new Set());

  const markHydrated = key => {
    hydratedKeysRef.current.add(key);
    if (hydratedKeysRef.current.size >= REQUIRED_KEYS.length) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribers = [
      subscribeToGas(value => {
        setData(current => ({ ...current, gas: value }));
        markHydrated('gas');
      }),
      subscribeToStatus(value => {
        setData(current => ({ ...current, status: value }));
        markHydrated('status');
      }),
      subscribeToFan(value => {
        setData(current => ({
          ...current,
          controls: { ...current.controls, fan: value },
        }));
        markHydrated('fan');
      }),
      subscribeToBuzzer(value => {
        setData(current => ({
          ...current,
          controls: { ...current.controls, buzzer: value },
        }));
        markHydrated('buzzer');
      }),
      subscribeToServo(value => {
        setData(current => ({
          ...current,
          controls: { ...current.controls, servo: value },
        }));
        markHydrated('servo');
      }),
      subscribeToThreshold(value => {
        setData(current => ({
          ...current,
          controls: { ...current.controls, threshold: value },
        }));
        markHydrated('threshold');
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
