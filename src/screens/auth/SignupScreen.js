import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import Header from '../../components/common/Header';
import InputField from '../../components/form/InputField';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { loginStyles } from '../../styles/screens/loginStyles';
import { COLORS } from '../../styles/colors';

const GREEN = '#16A34A';

// ─── Inline OTP Input (6 boxes with auto-focus) ───────────────────────────────
const OtpBoxInput = React.forwardRef(({ value = '', onChangeText, disabled }, ref) => {
  const inputs = useRef([]);
  const LENGTH = 6;

  React.useImperativeHandle(ref, () => ({
    focus: () => inputs.current[0]?.focus(),
  }));

  const handleChange = (text, index) => {
    const chars = value.split('');
    chars[index] = text.replace(/\D/g, '');
    const next = chars.join('');
    onChangeText(next);
    if (text && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const chars = value.split('');
      if (!chars[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
      chars[index] = '';
      onChangeText(chars.join(''));
    }
  };

  return (
    <View style={loginStyles.otpRow}>
      {Array(LENGTH).fill('').map((_, i) => (
        <TextInput
          key={i}
          ref={r => (inputs.current[i] = r)}
          style={[loginStyles.otpBox, disabled && { opacity: 0.6 }]}
          keyboardType="number-pad"
          maxLength={1}
          value={value[i] || ''}
          onChangeText={t => handleChange(t, i)}
          onKeyPress={e => handleKeyPress(e, i)}
          editable={!disabled}
          selectTextOnFocus
        />
      ))}
    </View>
  );
});

// ─── Main SignupScreen ─────────────────────────────────────────────────────────
export default function SignupScreen({ navigation, route }) {
  const phoneOtpRef = useRef(null);
  const emailOtpRef = useRef(null);

  // Pre-fill mobile if receiver arrived via a share link
  const prefillMobile = route?.params?.prefillMobile || '';

  // Form fields
  const [form, setForm] = useState({
    first: '', middle: '', last: '',
    phone: prefillMobile,  // pre-filled when coming from SharedCardPreviewScreen
    email: '',
    otpPhone: '', otpEmail: '',
  });
  const [errors, setErrors] = useState({});

  // OTP flow per channel: 'idle' | 'sent' | 'verified'
  const [phoneState, setPhoneState] = useState('idle');
  const [emailState, setEmailState] = useState('idle');

  // Countdown timers (seconds remaining)
  const [timerPhone, setTimerPhone] = useState(0);
  const [timerEmail, setTimerEmail] = useState(0);

  // Loading flags
  const [loadingPhone, setLoadingPhone]   = useState(false);
  const [loadingEmail, setLoadingEmail]   = useState(false);
  const [verifyPhone, setVerifyPhone]     = useState(false);
  const [verifyEmail, setVerifyEmail]     = useState(false);
  const [submitting, setSubmitting]       = useState(false);

  // ── Timers ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerPhone <= 0) return;
    const id = setInterval(() => setTimerPhone(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerPhone]);

  useEffect(() => {
    if (timerEmail <= 0) return;
    const id = setInterval(() => setTimerEmail(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerEmail]);

  // ── Auto-focus OTP boxes when they appear ───────────────────────────────────
  useEffect(() => {
    if (phoneState === 'sent') {
      const t = setTimeout(() => phoneOtpRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [phoneState]);

  useEffect(() => {
    if (emailState === 'sent') {
      const t = setTimeout(() => emailOtpRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [emailState]);

  // ── Validation ───────────────────────────────────────────────────────────────
  const validPhone = v => /^[1-9]\d{9}$/.test(v);
  const validEmail = v => /^\S+@\S+\.\S+$/.test(v);

  const handleChange = (name, value) => {
    let clean = value;
    if (name === 'first' || name === 'middle') clean = value.replace(/[^A-Za-z]/g, '').slice(0, 15);
    if (name === 'last') clean = value.replace(/[^A-Za-z ]/g, '').slice(0, 10);
    if (name === 'phone') clean = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'otpPhone' || name === 'otpEmail') clean = value.replace(/\D/g, '').slice(0, 6);
    setForm(p => ({ ...p, [name]: clean }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  // ── Send Phone OTP ───────────────────────────────────────────────────────────
  const sendPhoneOtp = async () => {
    if (!validPhone(form.phone)) {
      setErrors(p => ({ ...p, phone: 'Enter valid 10 digit number' }));
      return;
    }
    setLoadingPhone(true);
    try {
      const { res, data } = await apiFetch('/auth/mobile-signup', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: Number(form.phone) }),
      });
      if (res.ok && data?.status === 1) {
        setPhoneState('sent');
        setTimerPhone(30);
        setForm(p => ({ ...p, otpPhone: '' }));
      } else {
        Alert.alert('Error', data?.message || 'Unable to send OTP');
      }
    } catch (e) {
      Alert.alert('Network Error', e.message || 'Unable to send OTP');
    } finally {
      setLoadingPhone(false);
    }
  };

  // ── Send Email OTP ───────────────────────────────────────────────────────────
  const sendEmailOtp = async () => {
    if (!form.email.trim()) {
      setErrors(p => ({ ...p, email: 'Please enter your email address' }));
      return;
    }
    if (!validEmail(form.email)) {
      setErrors(p => ({ ...p, email: 'Please enter a valid email address' }));
      return;
    }
    setLoadingEmail(true);
    try {
      const { res, data } = await apiFetch('/auth/send-email-otp', {
        method: 'POST',
        body: JSON.stringify({ email: form.email.trim() }),
      });
      if (res.ok && data?.status === 1) {
        setEmailState('sent');
        setTimerEmail(30);
        setForm(p => ({ ...p, otpEmail: '' }));
      } else {
        Alert.alert('Error', data?.message || 'Unable to send OTP');
      }
    } catch (e) {
      Alert.alert('Network Error', e.message || 'Unable to send OTP');
    } finally {
      setLoadingEmail(false);
    }
  };

  // ── Edit (reset) Phone / Email ───────────────────────────────────────────────
  const editPhone = () => {
    setPhoneState('idle');
    setTimerPhone(0);
    setForm(p => ({ ...p, otpPhone: '' }));
    setErrors(p => ({ ...p, phone: '' }));
  };

  const editEmail = () => {
    setEmailState('idle');
    setTimerEmail(0);
    setForm(p => ({ ...p, otpEmail: '' }));
    setErrors(p => ({ ...p, email: '' }));
  };

  // ── Verify Phone OTP ─────────────────────────────────────────────────────────
  const verifyPhoneOtp = async () => {
    if (form.otpPhone.length !== 6) return;
    setVerifyPhone(true);
    try {
      const { res, data } = await apiFetch('/auth/verify-phone-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: Number(form.phone), otp: form.otpPhone }),
      });
      if (res.ok && data?.status === 1) {
        setPhoneState('verified');
        await AsyncStorage.setItem('userPhone', form.phone).catch(() => {});
      } else {
        Alert.alert('Invalid OTP', data?.message || 'OTP is incorrect. Please try again.');
        setForm(p => ({ ...p, otpPhone: '' }));
        setTimeout(() => phoneOtpRef.current?.focus(), 100);
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Verification failed');
    } finally {
      setVerifyPhone(false);
    }
  };

  // ── Verify Email OTP ─────────────────────────────────────────────────────────
  const verifyEmailOtp = async () => {
    if (form.otpEmail.length !== 6) return;
    setVerifyEmail(true);
    try {
      const { res, data } = await apiFetch('/auth/verify-email-otp', {
        method: 'POST',
        body: JSON.stringify({ email: form.email.trim(), otp: form.otpEmail }),
      });
      if (res.ok && data?.status === 1) {
        setEmailState('verified');
      } else {
        Alert.alert('Invalid OTP', data?.message || 'OTP is incorrect. Please try again.');
        setForm(p => ({ ...p, otpEmail: '' }));
        setTimeout(() => emailOtpRef.current?.focus(), 100);
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Verification failed');
    } finally {
      setVerifyEmail(false);
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const canSubmit =
    form.first.length >= 2 &&
    form.last.length >= 2 &&
    phoneState === 'verified' &&
    emailState === 'verified';

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const { res, data } = await apiFetch('/auth/final-submit', {
        method: 'POST',
        body: JSON.stringify({
          firstName: form.first,
          middleName: form.middle || null,
          lastName: form.last,
          mobileNumber: Number(form.phone),
          email: form.email.trim(),
        }),
      });
      if (res.ok && data?.status === 1) {
        // Store userId — session is already active (backend sets it on final-submit)
        if (data.userId) {
          await AsyncStorage.setItem('loggedInUserId', String(data.userId)).catch(() => {});
        }
        if (form.phone) {
          await AsyncStorage.setItem('userPhone', form.phone).catch(() => {});
        }
        // Auto-login: go directly to Landing so the user sees their pending cards in inbox
        Alert.alert(
          'Welcome to ShareCards! 🎉',
          'Your account has been created. Check your Inbox — shared cards are waiting for you!',
          [{ text: 'Go to Inbox', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Landing' }] }) }]
        );
      } else {
        Alert.alert('Error', data?.message || 'Registration failed. Please try again.');
      }
    } catch (e) {
      Alert.alert('Network Error', e.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Right button config helpers ──────────────────────────────────────────────
  const phoneRightButton = () => {
    if (phoneState === 'verified') return { label: '✔ Verified', disabled: true };
    if (phoneState === 'sent')     return { label: 'Edit', onPress: editPhone };
    return {
      label: loadingPhone ? 'Sending...' : 'Send OTP',
      onPress: sendPhoneOtp,
      disabled: !validPhone(form.phone) || loadingPhone,
    };
  };

  const emailRightButton = () => {
    if (emailState === 'verified') return { label: '✔ Verified', disabled: true };
    if (emailState === 'sent')     return { label: 'Edit', onPress: editEmail };
    return {
      label: loadingEmail ? 'Sending...' : 'Send OTP',
      onPress: sendEmailOtp,
      disabled: !validEmail(form.email) || loadingEmail,
    };
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={loginStyles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={loginStyles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1 }}>

            {/* ── Header (same as Login Screen) ── */}
            <Header style={loginStyles.header}>
              <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={loginStyles.iconWrap}>
                <Text style={loginStyles.icon}>💼</Text>
              </View>
              <Text style={loginStyles.appTitle}>Digital Business Card</Text>
              <Text style={loginStyles.subtitle}>Create your account</Text>
            </Header>

            {/* ── Card (same as Login Screen) ── */}
            <View style={loginStyles.card}>

              {/* Personal Info */}
              <InputField
                label="First Name"
                required
                icon="person-outline"
                placeholder="Enter first name"
                value={form.first}
                onChangeText={v => handleChange('first', v)}
                error={errors.first}
              />

              {/* <InputField
                label="Middle Name"
                icon="person-outline"
                placeholder="Enter middle name (optional)"
                value={form.middle}
                onChangeText={v => handleChange('middle', v)}
              /> */}

              <InputField
                label="Last Name"
                required
                icon="person-outline"
                placeholder="Enter last name"
                value={form.last}
                onChangeText={v => handleChange('last', v)}
                error={errors.last}
              />

              {/* Phone */}
              <InputField
                label="Mobile Number"
                required
                icon="call-outline"
                placeholder="10 digit number"
                keyboardType="number-pad"
                showCountry
                countryCode="+91"
                value={form.phone}
                onChangeText={v => handleChange('phone', v)}
                editable={phoneState === 'idle'}
                error={errors.phone}
                rightButton={phoneRightButton()}
              />

              {/* Phone OTP section */}
              {phoneState === 'sent' && (
                <View style={s.otpSection}>
                  <Text style={s.otpHint}>
                    Enter OTP sent to <Text style={s.otpHintBold}>+91 {form.phone}</Text>
                  </Text>

                  <OtpBoxInput
                    ref={phoneOtpRef}
                    value={form.otpPhone}
                    onChangeText={v => handleChange('otpPhone', v)}
                  />

                  <PrimaryButton
                    title={verifyPhone ? 'Verifying...' : 'Verify Phone OTP'}
                    onPress={verifyPhoneOtp}
                    disabled={form.otpPhone.length !== 6 || verifyPhone}
                  />

                  <TouchableOpacity
                    onPress={sendPhoneOtp}
                    disabled={timerPhone > 0 || loadingPhone}
                    style={loginStyles.resendWrap}
                  >
                    <Text style={loginStyles.resendText}>
                      {timerPhone > 0
                        ? `Resend OTP in ${timerPhone}s`
                        : loadingPhone ? 'Sending...' : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {phoneState === 'verified' && (
                <View style={s.verifiedRow}>
                  <Ionicons name="checkmark-circle" size={16} color={GREEN} />
                  <Text style={s.verifiedText}>Phone number verified successfully</Text>
                </View>
              )}

              {/* Email */}
              <InputField
                label="Email Address"
                required
                icon="mail-outline"
                placeholder="Enter email address"
                keyboardType="email-address"
                value={form.email}
                onChangeText={v => handleChange('email', v)}
                editable={emailState === 'idle'}
                error={errors.email}
                rightButton={emailRightButton()}
              />

              {/* Email OTP section */}
              {emailState === 'sent' && (
                <View style={s.otpSection}>
                  <Text style={s.otpHint}>
                    Enter OTP sent to <Text style={s.otpHintBold}>{form.email}</Text>
                  </Text>

                  <OtpBoxInput
                    ref={emailOtpRef}
                    value={form.otpEmail}
                    onChangeText={v => handleChange('otpEmail', v)}
                  />

                  <PrimaryButton
                    title={verifyEmail ? 'Verifying...' : 'Verify Email OTP'}
                    onPress={verifyEmailOtp}
                    disabled={form.otpEmail.length !== 6 || verifyEmail}
                  />

                  <TouchableOpacity
                    onPress={sendEmailOtp}
                    disabled={timerEmail > 0 || loadingEmail}
                    style={loginStyles.resendWrap}
                  >
                    <Text style={loginStyles.resendText}>
                      {timerEmail > 0
                        ? `Resend OTP in ${timerEmail}s`
                        : loadingEmail ? 'Sending...' : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {emailState === 'verified' && (
                <View style={s.verifiedRow}>
                  <Ionicons name="checkmark-circle" size={16} color={GREEN} />
                  <Text style={s.verifiedText}>Email verified successfully</Text>
                </View>
              )}

              {/* Submit */}
              <PrimaryButton
                title={submitting ? 'Creating Account...' : 'Create Account'}
                onPress={handleSubmit}
                disabled={!canSubmit || submitting}
              />

              {/* Login link */}
              <View style={loginStyles.dividerRow}>
                <View style={loginStyles.line} />
                <Text style={loginStyles.newHereText}>Have an account?</Text>
                <View style={loginStyles.line} />
              </View>

              <TouchableOpacity
                style={loginStyles.signupRow}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={loginStyles.createText}>Go back to </Text>
                <Text style={loginStyles.signupText}>Log In →</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Supplementary styles (only what loginStyles doesn't cover) ───────────────
const s = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  otpSection: {
    marginTop: -6,
    marginBottom: 10,
  },
  otpHint: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  otpHintBold: {
    fontWeight: '700',
    color: COLORS.text,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FFF4',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  verifiedText: {
    fontSize: 13,
    color: GREEN,
    fontWeight: '600',
  },
});
