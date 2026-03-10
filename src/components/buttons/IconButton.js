import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function IconButton({ onPress, children, style, accessibilityLabel }) {
  return (
    <TouchableOpacity onPress={onPress} accessibilityLabel={accessibilityLabel} style={[styles.button, style]}>
      <View>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
