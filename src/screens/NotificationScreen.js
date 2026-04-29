import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bell, AlertTriangle } from 'lucide-react-native';

const MOCK_HISTORY = [
  { id: '1', date: '2026-04-29', time: '14:32:00', level: 1450, type: 'DANGER' },
  { id: '2', date: '2026-04-28', time: '09:15:22', level: 1600, type: 'DANGER' },
  { id: '3', date: '2026-04-25', time: '18:40:10', level: 1350, type: 'WARNING' },
];

export const NotificationScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.alertCard}>
      <View style={[styles.iconBox, { backgroundColor: item.type === 'DANGER' ? '#4A1D24' : '#4A3B1D' }]}>
        {item.type === 'DANGER' ? (
          <AlertTriangle color="#FF4D4D" size={24} />
        ) : (
          <Bell color="#F5B041" size={24} />
        )}
      </View>
      <View style={styles.alertInfo}>
        <Text style={styles.alertTitle}>
          {item.type === 'DANGER' ? 'Gas Leak Detected' : 'High Gas Levels'}
        </Text>
        <Text style={styles.alertTime}>
          {item.date} • {item.time}
        </Text>
      </View>
      <View style={styles.levelBox}>
        <Text style={styles.levelText}>{item.level}</Text>
        <Text style={styles.ppmText}>PPM</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b111e" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#fff" size={28} />
        </Pressable>
        <Text style={styles.title}>Alert History</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* LIST */}
      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No alerts recorded.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b111e' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  listContent: { padding: 24 },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151e2f',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  alertInfo: { flex: 1 },
  alertTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  alertTime: { color: '#a0abc0', fontSize: 13 },
  levelBox: { alignItems: 'flex-end' },
  levelText: { color: '#ff4d4d', fontSize: 18, fontWeight: 'bold' },
  ppmText: { color: '#a0abc0', fontSize: 11 },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#a0abc0', fontSize: 16 }
});
