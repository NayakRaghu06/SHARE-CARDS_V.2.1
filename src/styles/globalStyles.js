import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Spacing scale (4-pt grid)
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  base: 16,
  lg:  20,
  xl:  24,
  xxl: 32,
  xxxl: 48,
};

// ── Border radii
export const RADIUS = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   20,
  xxl:  28,
  full: 999,
};

// ── Type scale
export const TYPE = {
  display:  { fontSize: 32, fontWeight: '800', lineHeight: 40, letterSpacing: -0.5 },
  h1:       { fontSize: 26, fontWeight: '700', lineHeight: 34, letterSpacing: -0.3 },
  h2:       { fontSize: 22, fontWeight: '700', lineHeight: 30 },
  h3:       { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  h4:       { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  body:     { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyMed:  { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  small:    { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  smallMed: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  caption:  { fontSize: 11, fontWeight: '500', lineHeight: 16, letterSpacing: 0.3 },
  label:    { fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0.2 },
  overline: { fontSize: 11, fontWeight: '700', lineHeight: 16, letterSpacing: 1.2 },
};

// ── Shadow presets
export const SHADOW = {
  none: {},
  xs: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  gold: {
    shadowColor: COLORS.accent,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  goldSm: {
    shadowColor: COLORS.accent,
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
};

// ── Screen helpers
export const SCREEN = {
  width: SCREEN_WIDTH,
  contentPadding: SPACING.base,
  cardPadding: SPACING.base,
};

export const globalStyles = StyleSheet.create({
  // ── Layout
  flex: { flex: 1 },
  flexCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  flexRow: { flexDirection: 'row' },
  flexRowCenter: { flexDirection: 'row', alignItems: 'center' },
  flexRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  flexRowEnd: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },

  // ── Typography
  display:  { ...TYPE.display,  color: COLORS.text },
  h1:       { ...TYPE.h1,       color: COLORS.text },
  h2:       { ...TYPE.h2,       color: COLORS.text },
  h3:       { ...TYPE.h3,       color: COLORS.text },
  h4:       { ...TYPE.h4,       color: COLORS.text },
  body:     { ...TYPE.body,     color: COLORS.text },
  bodyMed:  { ...TYPE.bodyMed,  color: COLORS.text },
  small:    { ...TYPE.small,    color: COLORS.textSecondary },
  smallMed: { ...TYPE.smallMed, color: COLORS.textSecondary },
  caption:  { ...TYPE.caption,  color: COLORS.textMuted },
  label:    { ...TYPE.label,    color: COLORS.text },
  overline: { ...TYPE.overline, color: COLORS.textMuted, textTransform: 'uppercase' },

  // Gold text variants
  accentText:  { color: COLORS.accent },
  mutedText:   { color: COLORS.textMuted },
  inverseText: { color: COLORS.textInverse },
  errorText:   { color: COLORS.error },

  // ── Spacing helpers
  p4:  { padding: 4 },
  p8:  { padding: 8 },
  p12: { padding: 12 },
  p16: { padding: 16 },
  p20: { padding: 20 },
  p24: { padding: 24 },
  px16: { paddingHorizontal: 16 },
  px20: { paddingHorizontal: 20 },
  py8:  { paddingVertical: 8 },
  py12: { paddingVertical: 12 },
  py16: { paddingVertical: 16 },
  mt8:  { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt24: { marginTop: 24 },
  mb8:  { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },

  // ── Cards
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    ...SHADOW.sm,
  },
  cardGold: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
    ...SHADOW.goldSm,
  },

  // ── Dividers
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.borderLight,
  },
  dividerGold: {
    height: 1.5,
    backgroundColor: COLORS.accent,
  },

  // ── Shared screen container
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
});

export default globalStyles;
