import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { COLORS } from '../../styles/colors';

/**
 * Animated gold spinning + pulsing loader.
 * Drop-in replacement for the old ActivityIndicator-based Loader.
 *
 * Usage:
 *   {loading && <Loader />}
 *   {loading && <Loader size={32} color="#D4AF37" />}
 */
const Loader = ({ size = 44, color = COLORS.accent }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse    = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous rotation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Gentle scale pulse: 1 → 1.12 → 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.12,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      rotation.stopAnimation();
      pulse.stopAnimation();
    };
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const borderWidth = Math.max(2, Math.round(size / 10));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth,
            borderColor: color,
            borderTopColor: 'transparent',
          },
          { transform: [{ rotate: spin }, { scale: pulse }] },
        ]}
      />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
