import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export function ControlSwitch({ label, value, onValueChange, disabled }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={Boolean(value)}
        onValueChange={nextValue => onValueChange(Boolean(nextValue))}
        disabled={disabled}
        trackColor={{ false: '#8F9BAD', true: '#2A8CFF' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DFEA',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#0C1B2E',
    fontSize: 16,
    fontWeight: '600',
  },
});
