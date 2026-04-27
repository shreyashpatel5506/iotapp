import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ControlSwitch } from '../components/ControlSwitch';
import { ThresholdControl } from '../components/ThresholdControl';
import { useRealtimeData } from '../hooks/useRealtimeData';

export function DashboardScreen() {
  const { data, loading, error, actions } = useRealtimeData();

  const isDanger = data.status === 'DANGER';
  const palette = isDanger ? DANGER_THEME : SAFE_THEME;

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#2A8CFF" />
        <Text style={styles.loadingText}>
          Connecting to Smart Gas system...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <StatusBar barStyle={isDanger ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[styles.banner, { backgroundColor: palette.bannerBackground }]}
        >
          <Text style={[styles.bannerTitle, { color: palette.bannerText }]}>
            {isDanger ? 'Gas Leak Detected' : 'Environment Stable'}
          </Text>
          <Text style={[styles.bannerSubtitle, { color: palette.bannerText }]}>
            {isDanger
              ? 'Backend status is DANGER. Follow your emergency protocol.'
              : 'System currently reports SAFE status.'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Realtime Monitoring</Text>
          <Text style={styles.gasValue}>{data.gas}</Text>
          <Text style={styles.gasLabel}>Gas Sensor Value</Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isDanger ? '#D61E38' : '#1D8F4E' },
            ]}
          >
            <Text style={styles.statusText}>{data.status}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Manual Controls</Text>
          <ControlSwitch
            label="Fan"
            value={data.controls.fan}
            onValueChange={value => actions.setControl('fan', value)}
          />
          <ControlSwitch
            label="Buzzer"
            value={data.controls.buzzer}
            onValueChange={value => actions.setControl('buzzer', value)}
          />
          <ControlSwitch
            label="Servo"
            value={data.controls.servo}
            onValueChange={value => actions.setControl('servo', value)}
          />
        </View>

        <ThresholdControl
          threshold={data.controls.threshold}
          onChangeThreshold={actions.setThreshold}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F8FC',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#29405F',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  banner: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  bannerSubtitle: {
    marginTop: 6,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DFEA',
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0C1B2E',
    marginBottom: 10,
  },
  gasValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#0C1B2E',
    lineHeight: 68,
  },
  gasLabel: {
    fontSize: 15,
    color: '#4F6075',
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 14,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  errorText: {
    marginTop: 10,
    color: '#B12439',
    fontSize: 14,
    textAlign: 'center',
  },
});

const SAFE_THEME = {
  background: '#EAF7EF',
  bannerBackground: '#1D8F4E',
  bannerText: '#FFFFFF',
};

const DANGER_THEME = {
  background: '#FFECEE',
  bannerBackground: '#D61E38',
  bannerText: '#FFFFFF',
};
