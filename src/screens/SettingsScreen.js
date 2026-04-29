import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  Pressable,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useIoTStore } from '../store/useIoTStore';
import { useRealtimeData } from '../hooks/useRealtimeData';

export const SettingsScreen = () => {
  const { settings, updateSettings } = useIoTStore();
  const { data, actions } = useRealtimeData();
  const currentThreshold = data?.controls?.threshold || settings.threshold;
  
  const [localThreshold, setLocalThreshold] = useState(
    currentThreshold.toString(),
  );

  useEffect(() => {
    setLocalThreshold(currentThreshold.toString());
  }, [currentThreshold]);

  const handleSave = () => {
    const val = parseInt(localThreshold, 10) || 1350;
    updateSettings({
      threshold: val,
    });
    actions.setThreshold(val);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b111e" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* HEADER */}
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Tune the alert threshold and optional notification behavior for your gas system.
        </Text>

        {/* THRESHOLD CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gas Alert Threshold</Text>
          <Text style={styles.helper}>
            Lower values trigger the alert sooner. Current value: {currentThreshold}
          </Text>

          <TextInput
            style={styles.input}
            value={localThreshold}
            onChangeText={setLocalThreshold}
            keyboardType="numeric"
            placeholder="Enter value"
            placeholderTextColor="#6C8BA1"
          />

          <Pressable style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Threshold</Text>
          </Pressable>
        </View>

        {/* TOGGLES CARD */}
        <View style={styles.card}>
          {/* Notifications */}
          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>Enable Notifications</Text>
              <Text style={styles.helper}>
                Allows Firebase alerts and in-app warning prompts.
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={val =>
                updateSettings({ notificationsEnabled: val })
              }
              trackColor={{ false: '#263145', true: '#2b9ca3' }}
              thumbColor={settings.notificationsEnabled ? '#68f5e9' : '#a0abc0'}
            />
          </View>

          {/* Emergency Call */}
          <View style={[styles.row, { marginTop: 24 }]}>
            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>Emergency Auto-Call</Text>
              <Text style={styles.helper}>
                Call the configured number when the alert state is active.
              </Text>
            </View>
            <Switch
              value={settings.emergencyCallEnabled}
              onValueChange={val =>
                updateSettings({ emergencyCallEnabled: val })
              }
              trackColor={{ false: '#263145', true: '#a34141' }}
              thumbColor={settings.emergencyCallEnabled ? '#68f5e9' : '#a0abc0'}
            />
          </View>

          {/* Auto Mode */}
          <View style={[styles.row, { marginTop: 24 }]}>
            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>Auto Mode</Text>
              <Text style={styles.helper}>
                Automatically trigger fan and notifications on danger.
              </Text>
            </View>
            <Switch
              value={settings.autoModeEnabled ?? true}
              onValueChange={val =>
                updateSettings({ autoModeEnabled: val })
              }
              trackColor={{ false: '#263145', true: '#2b9ca3' }}
              thumbColor={(settings.autoModeEnabled ?? true) ? '#68f5e9' : '#a0abc0'}
            />
          </View>

          {/* Voice Alerts */}
          <View style={[styles.row, { marginTop: 24 }]}>
            <View style={styles.textWrap}>
              <Text style={styles.cardTitle}>Voice Alerts</Text>
              <Text style={styles.helper}>
                Audible voice prompts during emergency states.
              </Text>
            </View>
            <Switch
              value={settings.voiceAlertsEnabled ?? false}
              onValueChange={val =>
                updateSettings({ voiceAlertsEnabled: val })
              }
              trackColor={{ false: '#263145', true: '#2b9ca3' }}
              thumbColor={settings.voiceAlertsEnabled ? '#68f5e9' : '#a0abc0'}
            />
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b111e',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#a0abc0',
    lineHeight: 22,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#151e2f',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  helper: {
    fontSize: 14,
    color: '#a0abc0',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#68f5e9',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWrap: {
    flex: 1,
    paddingRight: 16,
  },
});
