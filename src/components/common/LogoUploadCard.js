import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACCENT = '#D4AF37';

export default function LogoUploadCard({
  label = 'Company Logo',
  imageUri,
  onPress,
  onRemovePress,
  height = 120,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const onPressIn = () => {
    setIsPressed(true);
    Animated.timing(scaleAnim, { toValue: 0.97, duration: 120, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    setIsPressed(false);
    Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[
            styles.card,
            { height },
            !imageUri && styles.cardEmpty,
            { borderColor: isPressed ? ACCENT : (imageUri ? '#E5E7EB' : ACCENT) },
          ]}
        >
          {imageUri ? (
            <View style={styles.previewWrap}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={30} color={ACCENT} />
              <Text style={styles.placeholderText}>Tap to upload logo</Text>
            </View>
          )}

          {imageUri ? (
            <TouchableOpacity
              onPress={onRemovePress}
              style={styles.removeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.85}
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>
      </Animated.View>

      {imageUri ? (
        <TouchableOpacity onPress={onPress} style={styles.changeBtn} activeOpacity={0.85}>
          <Ionicons name="create-outline" size={15} color={ACCENT} />
          <Text style={styles.changeText}>Change Logo</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    color: '#0F0F0F',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardEmpty: {
    borderStyle: 'dashed',
    borderColor: ACCENT,
    backgroundColor: '#FFFCF2',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  placeholderText: {
    marginTop: 10,
    color: '#0F0F0F',
    fontSize: 14,
    fontWeight: '700',
  },
  previewWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  previewImage: {
    width: '92%',
    height: 80,
    maxHeight: 80,
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,24,39,0.66)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.45)',
  },
  changeBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#F1E2A3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  changeText: {
    marginLeft: 6,
    color: ACCENT,
    fontSize: 12,
    fontWeight: '700',
  },
});
