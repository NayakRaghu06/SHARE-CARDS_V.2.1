import React from 'react';
import { View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../styles/colors';

const Header = ({ children, style }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[{ backgroundImage: 'linear-gradient(180deg, #0F0F0F 0%, #1A1A1A 100%)' }, style]}>
        {children}
      </View>
    );
  }

  return (
    <LinearGradient colors={[COLORS.primary, '#1A1A1A']} style={style}>
      {children}
    </LinearGradient>
  );
};

export default Header;
