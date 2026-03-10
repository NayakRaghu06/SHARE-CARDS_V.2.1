import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Wraps any card with a fade-in + slide-up entrance animation.
 * Use the `index` prop to stagger multiple cards.
 *
 * Usage:
 *   <AnimatedCard index={0}>
 *     <MyCard />
 *   </AnimatedCard>
 *
 *   <AnimatedCard index={1}>
 *     <MyCard />
 *   </AnimatedCard>
 */
const AnimatedCard = ({ children, index = 0, style }) => {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    // Stagger each card by 60ms × its index
    const delay = index * 60;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        speed: 20,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default React.memo(AnimatedCard);
