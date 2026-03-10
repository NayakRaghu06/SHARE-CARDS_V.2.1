import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Outer glow ring behind the circle
  glowRing: {
    position: 'absolute',
    width: 308,
    height: 308,
    borderRadius: 154,
    borderWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.22,
  },

  circle: {
    backgroundColor: COLORS.accent,
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  logo: {
    width: 220,
    height: 220,
  },

  tagline: {
    color: '#C8C8C8',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.6,
  },
});
