import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function PhoneInput({ value, onChangeText, placeholder, style }) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        keyboardType="phone-pad"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
});
