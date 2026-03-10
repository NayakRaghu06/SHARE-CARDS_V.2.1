import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACCENT = '#D4AF37';

export default function UploadImage({
  label,
  imageUri,
  onUploadPress,
  onRemovePress,
  previewResizeMode = 'cover',
  containerHeight = 170,
}) {
  const fadeAnim = useRef(new Animated.Value(imageUri ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (imageUri) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [imageUri, fadeAnim]);

  const animatePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  };

  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={onUploadPress}
          onPressIn={animatePressIn}
          onPressOut={animatePressOut}
          style={[
            styles.card,
            { height: containerHeight },
            !imageUri && styles.cardEmpty,
          ]}
        >
          {imageUri ? (
            <Animated.View style={[styles.previewWrap, { opacity: fadeAnim }]}>
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode={previewResizeMode}
              />
            </Animated.View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={30} color={ACCENT} />
              <Text style={styles.placeholderTitle}>Tap to upload</Text>
              <Text style={styles.placeholderHint}>PNG or JPG</Text>
            </View>
          )}

          {imageUri ? (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={onRemovePress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>
      </Animated.View>

      {imageUri ? (
        <TouchableOpacity
          style={styles.changeBtn}
          onPress={onUploadPress}
          activeOpacity={0.85}
        >
          <Ionicons name="create-outline" size={16} color={ACCENT} />
          <Text style={styles.changeText}>Change Image</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
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
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  placeholderTitle: {
    marginTop: 10,
    color: '#0F0F0F',
    fontSize: 14,
    fontWeight: '700',
  },
  placeholderHint: {
    marginTop: 4,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  previewWrap: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(17,24,39,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
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
