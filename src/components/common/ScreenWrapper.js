import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../styles/colors';

const ScreenWrapper = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.wrapper, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default ScreenWrapper;
