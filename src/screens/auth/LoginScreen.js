import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import InputField from '../../components/form/InputField';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { loginStyles } from '../../styles/screens/loginStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import { saveSession } from '../../utils/storage';
import websocketService from '../../utils/websocketService';

const OTP_LENGTH = 6;

export default function LoginScreen({ navigation, route }) {
  const prefillMobile = route?.params?.prefillMobile || '';
  const [phone, setPhone]           = useState(prefillMobile);
  const [otpSent, setOtpSent]       = useState(false);
  const [otp, setOtp]               = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer]           = useState(0);
  const [canResend, setCanResend]   = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying]   = useState(false);

  const inputs = useRef([]);

  // ── Card entrance animation ───────────────────────────────────────────────────
  const cardOpacity    = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(56)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 380,
        delay: 120,
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslateY, {
        toValue: 0,
        delay: 120,
        useNativeDriver: true,
        speed: 18,
        bounciness: 5,
      }),
    ]).start();
  }, []);

  // ── Countdown timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Phone input ──────────────────────────────────────────────────────────────
  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    // Reset OTP flow if user edits the number
    if (otpSent) {
      setOtpSent(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimer(0);
      setCanResend(false);
    }
  };

  const validPhone = (v) => /^[1-9]\d{9}$/.test(v);
  const shouldShowSignupPrompt = (res, data) => {
    const msg = String(data?.message || '').toLowerCase();
    return (
      res?.status === 404 ||
      data?.status === 0 ||
      data?.status === 2 ||
      msg.includes('not registered') ||
      msg.includes('not found') ||
      msg.includes('no account') ||
      msg.includes('does not exist') ||
      msg.includes("doesn't exist")
    );
  };

  const showSignupAlert = (message) => {
    Alert.alert(
      'Account Not Found',
      message || 'No account found for this number. Please sign up first.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Signup', onPress: () => navigation.navigate('Signup') },
      ]
    );
  };

  // ── Start OTP flow (shared by Send and Resend) ───────────────────────────────
  const startOtpFlow = async (endpoint) => {
    setSendingOtp(true);
    try {
      const { res, data } = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: phone }),
      });

      if (res.ok && data?.status === 1) {
        setOtpSent(true);
        setOtp(Array(OTP_LENGTH).fill(''));
        setTimer(30);
        setCanResend(false);
        setTimeout(() => inputs.current[0]?.focus(), 300);
      } else if (shouldShowSignupPrompt(res, data)) {
        showSignupAlert(data?.message);
      } else {
        Alert.alert('Error', data?.message || 'Failed to send OTP. Please try again.');
      }
    } catch {
      Alert.alert('Network Error', 'Unable to connect. Please check your internet and try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  // ── Send OTP ─────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!validPhone(phone)) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    // Wipe any stale session BEFORE the OTP request so the server
    // creates a fresh session for this user — not the previous user's session
    try { await AsyncStorage.removeItem('sessionCookie'); } catch {}
    // Reset OTP state
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpSent(false);
    setTimer(0);
    setCanResend(false);
    startOtpFlow('/auth/mobile/login');
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResendOtp = () => {
    if (!canResend || sendingOtp) return;
    startOtpFlow('/auth/resend/login-otp');
  };

  // ── OTP box input ────────────────────────────────────────────────────────────
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const resetOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setTimeout(() => inputs.current[0]?.focus(), 200);
  };

  // ── Verify OTP & Login ───────────────────────────────────────────────────────
  const handleLogin = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== OTP_LENGTH) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits of the OTP.');
      return;
    }

    setVerifying(true);
    try {
      const { res, data } = await apiFetch('/auth/login/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobileNumber: phone, otp: enteredOtp }),
      });


      if (res.ok && data?.status === 1) {
        const normalizedPhone = String(phone || '').replace(/\D/g, '').slice(0, 10);
        await AsyncStorage.setItem('userPhone', normalizedPhone);

        // Fetch and store userId
        let resolvedUserId = null;
        try {
          const { res: profileRes, data: profileData } = await apiFetch('/user/profile');
          if (profileRes.ok && profileData?.data?.userId != null) {
            resolvedUserId = String(profileData.data.userId);
            await AsyncStorage.setItem('loggedInUserId', resolvedUserId);
          }
        } catch (e) {
          console.warn('Failed to save session', e);
        }

        if (resolvedUserId) {
          await websocketService.connect(resolvedUserId);
        }

        await saveSession(normalizedPhone);
        navigation.replace('Landing');

      } else if (shouldShowSignupPrompt(res, data)) {
        showSignupAlert(data?.message);
      } else {
        Alert.alert('Wrong OTP', data?.message || 'The OTP you entered is incorrect. Please try again.');
        resetOtp();
      }
    } catch {
      Alert.alert('Network Error', 'Login failed. Please check your internet connection.');
    } finally {
      setVerifying(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  const isSendDisabled = !validPhone(phone) || sendingOtp || (otpSent && timer > 0);

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

            {/* ── Header ── */}
            <Header style={loginStyles.header}>
              <View style={loginStyles.iconWrap}>
                <Text style={loginStyles.icon}>💼</Text>
              </View>
              <Text style={loginStyles.appTitle}>Digital Business Card</Text>
              <Text style={loginStyles.subtitle}>Grow your business digitally</Text>
            </Header>

            {/* ── Card ── */}
            <Animated.View
              style={[
                loginStyles.card,
                { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] },
              ]}
            >

              {/* Phone Input */}
              <InputField
                label="Mobile Number"
                icon="call-outline"
                placeholder="Enter mobile number"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="number-pad"
                showCountry
                countryCode="+91"
                editable={!verifying}
              />

              {/* Send OTP Button */}
              <PrimaryButton
                title={sendingOtp ? 'Sending OTP...' : otpSent ? 'OTP Sent' : 'Send OTP'}
                onPress={handleSendOtp}
                disabled={isSendDisabled}
              />

              {/* OTP Section */}
              {otpSent && (
                <>
                  <Text style={loginStyles.resendText} numberOfLines={1}>
                    OTP sent to +91 {phone}
                  </Text>

                  {/* OTP Boxes */}
                  <View style={loginStyles.otpRow}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={r => (inputs.current[index] = r)}
                        style={loginStyles.otpBox}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={value => handleOtpChange(value, index)}
                        onKeyPress={e => handleKeyPress(e, index)}
                        editable={!verifying}
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  {/* Resend Timer */}
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={!canResend || sendingOtp}
                    style={loginStyles.resendWrap}
                  >
                    <Text style={[
                      loginStyles.resendText,
                      (!canResend || sendingOtp) && { opacity: 0.5 },
                    ]}>
                      {sendingOtp
                        ? 'Sending...'
                        : canResend
                          ? 'Resend OTP'
                          : `Resend OTP in ${timer}s`}
                    </Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <PrimaryButton
                    title={verifying ? 'Verifying...' : 'Login'}
                    onPress={handleLogin}
                    disabled={otp.join('').length !== OTP_LENGTH || verifying}
                  />
                </>
              )}

              {/* Divider */}
              <View style={loginStyles.dividerRow}>
                <View style={loginStyles.line} />
                <Text style={loginStyles.newHereText}>New here?</Text>
                <View style={loginStyles.line} />
              </View>

              {/* Sign Up Link */}
              <TouchableOpacity
                style={loginStyles.signupRow}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={loginStyles.createText}>Create your account </Text>
                <Text style={loginStyles.signupText}>Sign Up →</Text>
              </TouchableOpacity>

            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

