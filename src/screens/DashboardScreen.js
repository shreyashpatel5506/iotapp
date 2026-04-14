import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Fan,
  RotateCcw,
  Settings as SettingsIcon,
  Radio,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react-native';
import { useIoTStore } from '../store/useIoTStore';
import { colors } from '../theme/colors';
import { AnimatedGauge } from '../components/AnimatedGauge';
import LinearGradient from 'react-native-linear-gradient';

export const DashboardScreen = () => {
  const { device, isConnected, updateDeviceToggle } = useIoTStore();
  const navigation = useNavigation();
  
  const isDanger = device.status === 'DANGER';
  
  return (
    <LinearGradient
      colors={[colors.backgroundAlt, colors.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Smart Gas</Text>
            <Text style={styles.subtitle}>
              {isDanger ? 'System activated protection.' : 'All systems normal.'}
            </Text>
          </View>
          <Pressable
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <SettingsIcon color={colors.textPrimary} size={22} />
          </Pressable>
        </View>

        {/* Dashboard Card */}
        <View style={styles.card3d}>
          <AnimatedGauge value={device.gasLevel} status={device.status} />
          <View style={styles.indicatorContainer}>
            <View style={styles.indicatorRow}>
              <Radio color={isDanger ? colors.danger : colors.success} size={18} />
              <Text style={styles.indicatorLabel}>System Status:</Text>
              <Text
                style={[
                  styles.indicatorValue,
                  { color: isDanger ? colors.danger : colors.success, marginLeft: 8 },
                ]}
              >
                {device.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Alert Section */}
        <View style={[styles.alertCard, isDanger && styles.alertCardDanger]}>
          <AlertTriangle
            color={isDanger ? colors.danger : colors.warning}
            size={24}
          />
          <View style={styles.alertCopy}>
            <Text style={styles.alertLabel}>Last Alert Message</Text>
            <Text style={styles.alertValue} numberOfLines={2}>
              {device.lastAlert}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Device Controls</Text>
        </View>

        {/* Controls Grid */}
        <View style={styles.statsGrid}>
          {/* Fan */}
          <Pressable
            style={[styles.statCard, device.fan && styles.interactiveCard]}
            onPress={() => updateDeviceToggle('fan', !device.fan)}
          >
            <Fan
              color={device.fan ? colors.primary : colors.textMuted}
              size={24}
            />
            <Text style={styles.statLabel}>Exhaust Fan</Text>
            <Text
              style={[
                styles.statValue,
                { color: device.fan ? colors.primary : colors.textPrimary },
              ]}
            >
              {device.fan ? 'ON' : 'OFF'}
            </Text>
          </Pressable>

          {/* Buzzer */}
          <Pressable
            style={[styles.statCard, device.buzzer && styles.dangerCard]}
            onPress={() => updateDeviceToggle('buzzer', !device.buzzer)}
          >
            <ShieldAlert
              color={device.buzzer ? colors.danger : colors.textMuted}
              size={24}
            />
            <Text style={styles.statLabel}>Alarm Buzzer</Text>
            <Text
              style={[
                styles.statValue,
                { color: device.buzzer ? colors.danger : colors.textPrimary },
              ]}
            >
              {device.buzzer ? 'ON' : 'OFF'}
            </Text>
          </Pressable>

          {/* Servo */}
          <Pressable
            style={[styles.statCard, device.servo && styles.interactiveCard]}
            onPress={() => updateDeviceToggle('servo', !device.servo)}
          >
            <RotateCcw
              color={device.servo ? colors.primary : colors.textMuted}
              size={24}
            />
            <Text style={styles.statLabel}>Gas Valve Servo</Text>
            <Text
              style={[
                styles.statValue,
                { color: device.servo ? colors.primary : colors.textPrimary },
              ]}
            >
              {device.servo ? 'ON' : 'OFF'}
            </Text>
          </Pressable>

          {/* Servo Status */}
          <View style={[styles.statCard, { justifyContent: 'center' }]}>
            <Text style={styles.statLabel}>Servo Angle</Text>
            <Text style={styles.statValue}>{device.servoAngle}°</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  card3d: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 30,
    padding: 20,
    marginBottom: 18,
    shadowColor: colors.primaryGlow,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    marginLeft: 8,
  },
  indicatorValue: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertCardDanger: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBackground,
  },
  alertCopy: {
    marginLeft: 14,
    flex: 1,
  },
  alertLabel: {
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  alertValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 110,
  },
  interactiveCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
  },
  dangerCard: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBackground,
    borderWidth: 1.5,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 16,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },
});
