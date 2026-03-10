import React, { useRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../../styles/colors';

const { width } = Dimensions.get('window');

const OtpInput = React.forwardRef(({ length = 6, onChangeText, value = '', rightButton }, ref) => {
  const inputs = useRef([]);

  useImperativeHandle(ref, () => ({
    focus: () => inputs.current[0]?.focus(),
  }));

  const handleChange = (text, index) => {
    const newValue = (value || '').split('');
    newValue[index] = text;
    const result = newValue.join('');
    
    onChangeText(result);

    // Move to next input
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!value?.[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
      const newValue = (value || '').split('');
      newValue[index] = '';
      onChangeText(newValue.join(''));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsWrap}>
        {Array(length)
          .fill('')
          .map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={1}
              value={value?.[index] || ''}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
      </View>
      {rightButton ? (
        <TouchableOpacity
          style={[styles.verifyBtn, rightButton.disabled && { opacity: 0.5 }]}
          onPress={rightButton.onPress}
          disabled={rightButton.disabled}
        >
          <Text style={styles.verifyText}>{rightButton.label}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 18,
  },
  inputsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  input: {
    width: width / 8,
    height: 48,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '700',
  },
  verifyBtn: {
    marginLeft: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  verifyText: {
    color: COLORS.accent,
    fontWeight: '700',
  },
});

export default OtpInput;
