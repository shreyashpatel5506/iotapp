import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  Vibration,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useIoTStore } from '../store/useIoTStore';
import { AlertTriangle, PhoneCall, Flame, Phone } from 'lucide-react-native';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, withSequence } from 'react-native-reanimated';

export const AlertScreen = () => {
  const { settings, triggerReset } = useIoTStore();

  const [countdown, setCountdown] = useState(10);
  const [callCancelled, setCallCancelled] = useState(false);

  // Flashing animation
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.2, { duration: 400 }), withTiming(1, { duration: 400 })),
      -1,
      true
    );

    return () => {
      opacity.value = 1;
    };
  }, [opacity]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !callCancelled && settings.emergencyCallEnabled) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !callCancelled && settings.emergencyCallEnabled) {
      // Auto-call when countdown hits 0
      placeCall('9054003478');
      setCallCancelled(true); // Stop further calls
    }
    return () => clearTimeout(timer);
  }, [countdown, callCancelled, settings]);

  const placeCall = (number) => {
    Linking.openURL(`tel:${number}`).catch((err) => console.error("Error opening dialer", err));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: '#3D0A0A' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#3D0A0A" />

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* FLASHING WARNING */}
        <Animated.View style={[styles.alertHeader, animatedStyle]}>
          <AlertTriangle size={60} color="#FF4D4D" />
          <Text style={styles.title}>⚠ GAS LEAK DETECTED</Text>
        </Animated.View>

        <Text style={styles.warningText}>
          Evacuate the area immediately. Do not turn on any electrical switches.
        </Text>

        {/* COUNTDOWN & AUTO CALL */}
        {settings.emergencyCallEnabled && !callCancelled && (
          <View style={styles.countdownBox}>
            <Text style={styles.countdownText}>
              Calling emergency in {countdown} seconds...
            </Text>
            <View style={styles.countdownActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setCallCancelled(true)}>
                <Text style={styles.cancelText}>Cancel Call ❌</Text>
              </Pressable>
              <Pressable style={styles.callNowBtn} onPress={() => { setCallCancelled(true); placeCall('9054003478'); }}>
                <Text style={styles.callNowText}>Call Now 📞</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* LARGE EMERGENCY BUTTONS */}
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        
        <Pressable style={styles.bigCallBtn} onPress={() => placeCall('9054003478')}>
          <View style={styles.iconCircle}>
            <PhoneCall size={24} color="#2ECC71" />
          </View>
          <View style={styles.btnTextContainer}>
            <Text style={styles.btnTitle}>Call Saved Contact</Text>
            <Text style={styles.btnSubtitle}>Dial 90540 03478</Text>
          </View>
          <PhoneCall color="#fff" size={24} />
        </Pressable>


        {/* SYSTEM ACTIONS */}
        <View style={{ height: 30 }} />
        <Pressable style={styles.resetBtn} onPress={() => triggerReset('all')}>
          <Text style={styles.resetText}>RESET SYSTEM & DISMISS</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60, alignItems: 'center' },
  alertHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: { 
    color: '#FF4D4D', 
    fontSize: 28, 
    fontWeight: '900', 
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 1
  },
  warningText: {
    color: '#FFB8B8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    fontWeight: '500'
  },
  countdownBox: {
    backgroundColor: 'rgba(255, 77, 77, 0.15)',
    borderWidth: 1,
    borderColor: '#FF4D4D',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    alignItems: 'center'
  },
  countdownText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  countdownActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#2A0F14',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4A1D24'
  },
  cancelText: { color: '#a0abc0', fontSize: 16, fontWeight: 'bold' },
  callNowBtn: {
    flex: 1,
    backgroundColor: '#FF4D4D',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  callNowText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: {
    color: '#a0abc0',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    alignSelf: 'flex-start'
  },
  bigCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  btnTextContainer: {
    flex: 1,
  },
  btnTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  btnSubtitle: {
    color: '#a0abc0',
    fontSize: 14,
  },
  resetBtn: {
    backgroundColor: '#1C0404',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#FF4D4D',
  },
  resetText: { color: '#FF4D4D', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
