import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';

export const signupStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: 55,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 30,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: '#fff',
    marginTop: 6,
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginTop: -55,
    borderRadius: 28,
    padding: 22,
    elevation: 6,
  },
  otpBox: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 22,
    height: 58,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginTop: 15,
  },
  resend: {
    textAlign: 'center',
    marginTop: 10,
    color: COLORS.accent,
    fontWeight: '600',
  },
});
