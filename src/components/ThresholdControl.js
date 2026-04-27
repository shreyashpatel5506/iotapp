import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Slider from '@react-native-community/slider';

const MIN_THRESHOLD = 1000;
const MAX_THRESHOLD = 4000;

function parseThreshold(valueText) {
  const normalized = valueText.replace(/[^0-9]/g, '');
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(MIN_THRESHOLD, Math.min(MAX_THRESHOLD, parsed));
}

export function ThresholdControl({ threshold, onChangeThreshold, disabled }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Threshold</Text>
      <Text style={styles.helper}>
        Range: 1000–4000 (updates Firebase instantly)
      </Text>

      <Slider
        style={styles.slider}
        minimumValue={MIN_THRESHOLD}
        maximumValue={MAX_THRESHOLD}
        value={threshold}
        step={1}
        onValueChange={value => onChangeThreshold(Math.round(value))}
        minimumTrackTintColor="#2A8CFF"
        maximumTrackTintColor="#A8B8CC"
        thumbTintColor="#2A8CFF"
        disabled={disabled}
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(threshold)}
        onChangeText={text => {
          const parsed = parseThreshold(text);
          if (parsed !== null) {
            onChangeThreshold(parsed);
          }
        }}
        editable={!disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5DFEA',
    padding: 16,
  },
  label: {
    color: '#0C1B2E',
    fontSize: 16,
    fontWeight: '700',
  },
  helper: {
    color: '#4F6075',
    fontSize: 13,
    marginTop: 4,
  },
  slider: {
    marginTop: 8,
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#C8D5E5',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#0C1B2E',
    fontSize: 16,
    backgroundColor: '#F8FBFF',
  },
});
