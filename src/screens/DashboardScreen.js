import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Pressable, Modal, Switch, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Settings, Bell, AlertTriangle, Fan, ShieldAlert, RotateCw, Phone } from 'lucide-react-native';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, withSequence } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { GasChart } from '../components/GasChart';
import { ThresholdControl } from '../components/ThresholdControl';

export function DashboardScreen() {
  const { data, actions } = useRealtimeData();
  const navigation = useNavigation();

  const placeCall = (number) => {
    Linking.openURL(`tel:${number}`).catch((err) => console.error("Error opening dialer", err));
  };


  const prevStatusRef = useRef(data.status);
  const [showSafeModal, setShowSafeModal] = useState(false);
  const [resetBuzzer, setResetBuzzer] = useState(true);
  const [resetFan, setResetFan] = useState(true);
  const [resetServo, setResetServo] = useState(true);
  const [dismissedDanger, setDismissedDanger] = useState(false);

  useEffect(() => {
    if (prevStatusRef.current === 'DANGER' && data.status === 'SAFE') {
      setShowSafeModal(true);
    }
    prevStatusRef.current = data.status;
  }, [data.status]);


  const handleConfirmReset = async () => {
    if (resetBuzzer) await actions.setControl('buzzer', false);
    if (resetFan) await actions.setControl('fan', false);
    if (resetServo) await actions.setControl('servo', false);
    setShowSafeModal(false);
  };

  const hasAutoCalledRef = useRef(false);

  useEffect(() => {
    if (isDanger) {
      if (!hasAutoCalledRef.current) {
        placeCall('9054003478');
        hasAutoCalledRef.current = true;
      }
    } else {
      // Reset auto-call flag once system clears
      hasAutoCalledRef.current = false;
      setDismissedDanger(false);
    }
  }, [isDanger]);




  const isDanger = data.status === 'DANGER';
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isDanger) {
      opacity.value = withRepeat(
        withSequence(withTiming(0.3, { duration: 500 }), withTiming(1, { duration: 500 })),
        -1,
        true
      );
    } else {
      opacity.value = 1;
    }
  }, [isDanger, opacity]);

  const animatedWarningStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const chartData = [1200, 1250, 1300, 1280, 1400, data.gas || 1400];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b111e" />

      {/* FULL-SCREEN BLOCKING DANGER MODAL */}
      <Modal
        visible={isDanger && !dismissedDanger}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setDismissedDanger(true)}
      >
        <View style={styles.blockingModalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#7f1d1d" />
          <Animated.View style={[styles.blockingAlertCircle, animatedWarningStyle]}>
            <AlertTriangle size={80} color="#ef4444" />
          </Animated.View>
          <Text style={styles.blockingModalTitle}>🚨 Gas Leak Detected</Text>
          <Text style={styles.blockingModalSubtitle}>
            Dangerous gas levels detected! System is locked down. Evacuate immediately.
          </Text>
          <View style={styles.liveGasContainer}>
            <Text style={styles.liveGasText}>Current Gas Level:</Text>
            <Text style={styles.liveGasPPM}>{data.gas} PPM</Text>
          </View>

          <Pressable 
            style={styles.blockingCallBtn} 
            onPress={() => placeCall('9054003478')}
          >
            <Phone size={24} color="#fff" style={{ marginRight: 12 }} />
            <Text style={styles.blockingCallBtnText}>Call Emergency Help</Text>
          </Pressable>

          <Pressable 
            style={styles.dismissBtn} 
            onPress={() => setDismissedDanger(true)}
          >
            <Text style={styles.dismissBtnText}>View Dashboard</Text>
          </Pressable>

        </View>
      </Modal>


      {/* SYSTEM SAFE TRANSITION POPUP MODAL */}
      <Modal
        visible={showSafeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSafeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.safeModalContent}>
            <Text style={styles.safeModalTitle}>System Safe</Text>
            <Text style={styles.safeModalSubtitle}>
              Gas level is normal. Reset devices?
            </Text>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Buzzer OFF</Text>
              <Switch
                value={resetBuzzer}
                onValueChange={setResetBuzzer}
                trackColor={{ false: '#334155', true: '#10b981' }}
                thumbColor={resetBuzzer ? '#fff' : '#94a3b8'}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Fan OFF</Text>
              <Switch
                value={resetFan}
                onValueChange={setResetFan}
                trackColor={{ false: '#334155', true: '#10b981' }}
                thumbColor={resetFan ? '#fff' : '#94a3b8'}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Servo OFF</Text>
              <Switch
                value={resetServo}
                onValueChange={setResetServo}
                trackColor={{ false: '#334155', true: '#10b981' }}
                thumbColor={resetServo ? '#fff' : '#94a3b8'}
              />
            </View>

            <Pressable style={styles.confirmBtn} onPress={handleConfirmReset}>
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Smart Gas Monitor</Text>
            <Text style={[styles.subtitle, { color: isDanger ? '#ff6b6b' : '#94a3b8' }]}>
              {isDanger ? '⚠️ Gas Leak Detected' : '⚡ All systems normal.'}
            </Text>
            <View style={styles.connectionBox}>
              <View style={[styles.connectionDot, { backgroundColor: data.isConnected ? '#10b981' : '#ef4444' }]} />
              <Text style={styles.connectionText}>
                ESP32 {data.isConnected ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <Pressable
              style={[styles.settingsBtn, { marginRight: 12 }]}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Bell color="#94a3b8" size={22} />
            </Pressable>
            <Pressable
              style={styles.settingsBtn}
              onPress={() => navigation.navigate('Settings')}
            >
              <Settings color="#94a3b8" size={22} />
            </Pressable>
          </View>
        </View>

        {/* CIRCLE METER */}
        <View style={[styles.card, isDanger && styles.cardDangerBorder]}>
          <View style={[styles.circle, { borderColor: isDanger ? '#ef4444' : '#334155' }]}>
            <Text style={styles.gasValue}>{data.gas}</Text>
            <Text style={styles.ppm}>PPM</Text>

            <View
              style={[
                styles.badge,
                { backgroundColor: isDanger ? '#ef4444' : '#10b981' },
              ]}
            >
              <Text style={styles.badgeText}>
                {isDanger ? 'DANGER' : 'SAFE'}
              </Text>
            </View>
          </View>

          <Text style={styles.systemStatus}>
            Status:{' '}
            <Text style={{ color: isDanger ? '#ef4444' : '#10b981', fontWeight: '700' }}>
              {data.status}
            </Text>
          </Text>
        </View>

        {/* ALERT */}
        <Animated.View style={[styles.alertBox, isDanger && animatedWarningStyle, isDanger ? { backgroundColor: '#3b0712' } : { backgroundColor: '#1e293b' }]}>
          <AlertTriangle color={isDanger ? '#ef4444' : '#94a3b8'} size={22} style={{ marginRight: 8 }} />
          <Text style={[styles.alertText, { color: isDanger ? '#ef4444' : '#94a3b8' }]}>
            {isDanger ? 'SYSTEM LOCKDOWN - EVACUATE' : 'Monitoring Active'}
          </Text>
        </Animated.View>

        {/* GAS CHART */}
        <GasChart dataPoints={chartData} isDanger={isDanger} />

        {/* THRESHOLD CONTROL (SLIDER) */}
        <View style={styles.sliderContainer}>
          <ThresholdControl
            threshold={data?.controls?.threshold || 3113}
            onChangeThreshold={(val) => actions.setThreshold(val)}
            disabled={isDanger}
          />
        </View>

        {/* DEVICE CONTROLS */}
        <Text style={styles.sectionTitle}>System Modules</Text>

        <View style={styles.grid}>
          {/* Fan - Manual Control */}
          <Pressable 
            style={styles.newControlCardWrapper}
            onPress={() => !isDanger && actions.setControl('fan', !data.controls.fan)}
          >
            <View style={[styles.newControlCard, { backgroundColor: data.controls.fan ? '#083344' : '#1e293b' }]}>
              <Fan size={26} color={data.controls.fan ? '#22d3ee' : '#64748b'} />
              <View style={styles.cardBottom}>
                <Text style={styles.newControlTitle}>Exhaust Fan</Text>
                <Text style={[styles.newControlValue, { color: data.controls.fan ? '#22d3ee' : '#64748b' }]}>
                  {data.controls.fan ? 'ON' : 'OFF'}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Buzzer - Manual Control */}
          <Pressable 
            style={styles.newControlCardWrapper}
            onPress={() => !isDanger && actions.setControl('buzzer', !data.controls.buzzer)}
          >
            <View style={[styles.newControlCard, { backgroundColor: data.controls.buzzer ? '#4c0519' : '#1e293b' }]}>
              <ShieldAlert size={26} color={data.controls.buzzer ? '#f87171' : '#64748b'} />
              <View style={styles.cardBottom}>
                <Text style={styles.newControlTitle}>Alarm Buzzer</Text>
                <Text style={[styles.newControlValue, { color: data.controls.buzzer ? '#f87171' : '#64748b' }]}>
                  {data.controls.buzzer ? 'ON' : 'OFF'}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Gas Valve Servo - Manual Control */}
          <Pressable 
            style={styles.newControlCardWrapper}
            onPress={() => !isDanger && actions.setControl('servo', !data.controls.servo)}
          >
            <View style={[styles.newControlCard, { backgroundColor: data.controls.servo ? '#1e1b4b' : '#1e293b' }]}>
              <RotateCw size={26} color={data.controls.servo ? '#818cf8' : '#64748b'} />
              <View style={styles.cardBottom}>
                <Text style={styles.newControlTitle}>Gas Valve Servo</Text>
                <Text style={[styles.newControlValue, { color: data.controls.servo ? '#818cf8' : '#64748b' }]}>
                  {data.controls.servo ? 'ON' : 'OFF'}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Servo Angle - Passive Display */}
          <View style={styles.newControlCardWrapper}>
            <View style={[styles.newControlCard, { backgroundColor: '#1e293b', justifyContent: 'flex-end' }]}>
              <View style={styles.cardBottom}>
                <Text style={styles.newControlTitle}>Servo Angle</Text>
                <Text style={[styles.newControlValue, { color: '#f8fafc' }]}>
                  {data.controls.servo ? '90°' : '0°'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b111e' },
  content: { padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  headerIcons: { flexDirection: 'row' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#a0abc0', marginBottom: 8 },
  connectionBox: { flexDirection: 'row', alignItems: 'center' },
  connectionDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  connectionText: { fontSize: 12, color: '#6C8BA1', fontWeight: '500' },
  settingsBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#151e2f', justifyContent: 'center', alignItems: 'center' },
  card: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardDangerBorder: {
    borderColor: '#ef4444',
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gasValue: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  ppm: { fontSize: 16, color: '#a0abc0', marginBottom: 8 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  systemStatus: { fontSize: 16, color: '#a0abc0' },
  alertBox: {
    backgroundColor: '#2d1b22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  alertText: { color: '#ff6b6b', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  newControlCardWrapper: {
    width: '48%',
    height: 140,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  newControlCard: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardBottom: {
    marginTop: 'auto',
  },
  newControlTitle: {
    fontSize: 14,
    color: '#a0abc0',
    marginBottom: 6,
    fontWeight: '500'
  },
  newControlValue: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  sliderContainer: {
    marginBottom: 24,
  },
  blockingModalContainer: {
    flex: 1,
    backgroundColor: '#7f1d1d',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  blockingAlertCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  blockingModalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  blockingModalSubtitle: {
    fontSize: 16,
    color: '#fecaca',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  liveGasContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  liveGasText: {
    fontSize: 16,
    color: '#fecaca',
    marginBottom: 4,
  },
  liveGasPPM: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  safeModalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#334155',
  },
  safeModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  safeModalSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '500',
  },
  confirmBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  blockingCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 40,
    width: '100%',
  },
  blockingCallBtnText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  dismissBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dismissBtnText: {
    fontSize: 16,
    color: '#fca5a5',
    fontWeight: '600',
  },
});



