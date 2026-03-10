import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function PasswordField({ value, onChangeText, placeholder, style, secureTextEntry = true }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
});
