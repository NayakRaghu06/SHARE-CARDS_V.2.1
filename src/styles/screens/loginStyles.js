import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../colors';

const { width } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
  },

  // ── Hero header (gradient applied by Header component)
  header: {
    height: 290,
    paddingHorizontal: 24,
    paddingTop: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  iconWrap: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 50,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#C9A84C',
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  icon: {
    fontSize: 30,
    color: '#C9A84C',
  },
  appTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    marginTop: 5,
    fontSize: 13,
    letterSpacing: 0.2,
  },

  // ── Form card (animated in LoginScreen.js)
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -28,
    borderRadius: 22,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },

  // ── OTP row
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 6,
  },
  otpBox: {
    width: (width - 40 - 44 - 30) / 6,
    height: 52,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '700',
    backgroundColor: '#FAFAFA',
  },

  // ── Resend
  resendWrap: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  resendText: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0',
  },
  newHereText: {
    marginHorizontal: 12,
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },

  // ── Sign-up link
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  createText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  signupText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '800',
  },

  loginBtn: {
    backgroundColor: COLORS.accent,
    marginTop: 10,
  },
});
