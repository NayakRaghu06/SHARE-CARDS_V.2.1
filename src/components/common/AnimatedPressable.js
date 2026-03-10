import React, { useRef, useCallback } from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';

/**
 * Drop-in replacement for TouchableOpacity.
 * Adds a smooth spring scale-down on press and spring scale-back on release.
 *
 * Usage:
 *   <AnimatedPressable onPress={...} style={...}>
 *     <Text>Button</Text>
 *   </AnimatedPressable>
 */
const AnimatedPressable = ({
  children,
  onPress,
  style,
  scaleTo = 0.96,
  disabled = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.timing(scale, {
      toValue: scaleTo,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [scale, scaleTo]);

  const pressOut = useCallback(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <TouchableWithoutFeedback
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(AnimatedPressable);
