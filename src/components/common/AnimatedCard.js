import React from 'react';
import { View } from 'react-native';

const AnimatedCard = ({ children, style }) => (
  <View style={style}>{children}</View>
);

export default React.memo(AnimatedCard);
