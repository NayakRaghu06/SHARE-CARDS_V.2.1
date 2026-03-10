import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACCENT = '#D4AF37';

export default function ProfileAvatarUpload({
  imageUri,
  onPress,
  onRemovePress,
  size = 110,
  label = 'Profile Photo',
  centered = false,
}) {
  const avatarSize = { width: size, height: size, borderRadius: size / 2 };
  const cameraSize = Math.max(34, Math.round(size * 0.3));
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.wrapper, centered && styles.wrapperCentered]}>
      <Text style={[styles.label, centered && styles.labelLeftWhenCentered]}>{label}</Text>

      <View style={styles.avatarWrap}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[styles.avatarTouch, avatarSize]}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={[styles.avatarImage, avatarSize]} />
            ) : (
              <View style={[styles.placeholder, avatarSize]}>
                <Ionicons name="person" size={46} color={ACCENT} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[
            styles.cameraBtn,
            {
              width: cameraSize,
              height: cameraSize,
              borderRadius: cameraSize / 2,
            },
          ]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Ionicons name="camera" size={18} color="#0F0F0F" />
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Tap to change photo</Text>

      {imageUri ? (
        <TouchableOpacity onPress={onRemovePress} activeOpacity={0.8} style={styles.removeBtn}>
          <Ionicons name="trash-outline" size={15} color="#D97706" />
          <Text style={styles.removeText}>Remove photo</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  wrapperCentered: {
    width: '100%',
    alignItems: 'center',
  },
  labelLeftWhenCentered: {
    alignSelf: 'flex-start',
  },
  label: {
    color: '#0F0F0F',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarTouch: {
    borderWidth: 2,
    borderColor: ACCENT,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 9,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#F3F4F6',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFCF2',
  },
  cameraBtn: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 3,
  },
  hint: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  removeBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FCD9BD',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  removeText: {
    marginLeft: 6,
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
});
