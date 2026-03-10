import { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/colors';

export default function InputField({
  label,
  required,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  showCountry,
  countryCode,
  icon,
  error,
  rightButton,
  editable = true,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [iconScaleAnim, scaleAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [iconScaleAnim, scaleAnim]);

  return (
    <View style={styles.wrapper}>
      {/* LABEL ROW */}
      <View style={styles.labelRow}>
        <View style={styles.left}>
          <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
            <Ionicons
              name={icon}
              size={17}
              color={isFocused ? COLORS.accent : COLORS.textMuted}
            />
          </Animated.View>
          <Text style={[styles.label, isFocused && styles.labelFocused]}>
            {'  '}
            {label}
            {required && <Text style={styles.star}> *</Text>}
          </Text>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      {/* INPUT BOX */}
      <Animated.View
        style={[
          styles.inputBox,
          value?.trim?.() ? styles.inputBoxFilled : null,
          isFocused && styles.inputBoxFocused,
          error && styles.inputBoxError,
          !editable && styles.inputBoxDisabled,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {showCountry && (
          <View style={styles.countryPill}>
            <Text style={styles.countryText}>{countryCode}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType || 'default'}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {rightButton ? (
          <TouchableOpacity
            style={[styles.rightBtn, rightButton.disabled && { opacity: 0.5 }]}
            onPress={rightButton.onPress}
            disabled={rightButton.disabled}
          >
            <Text style={styles.rightBtnText}>{rightButton.label}</Text>
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },

  // ── Label
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  labelFocused: {
    color: COLORS.accent,
  },
  star: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Input box
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8F9FB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputBoxFilled: {
    backgroundColor: '#FFFFFF',
  },
  inputBoxFocused: {
    borderColor: COLORS.accent,
    borderWidth: 1.5,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  inputBoxError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  inputBoxDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.85,
  },

  // ── +91 pill
  countryPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  countryText: {
    fontWeight: '700',
    color: COLORS.accent,
    fontSize: 14,
  },

  // ── Text input (fixes invisible typing)
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },

  // ── Right button
  rightBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 10,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightBtnText: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 13,
  },
});
