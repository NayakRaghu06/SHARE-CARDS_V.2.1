<<<<<<< HEAD
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const AnimatedCard = ({ children, index = 0, style }) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

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
=======
import React from 'react';
import { View } from 'react-native';

const AnimatedCard = ({ children, style }) => (
  <View style={style}>{children}</View>
);
>>>>>>> 53566a4c67d29d43ac7234b4bee460f0d58a5ebc

export default AnimatedCard;
