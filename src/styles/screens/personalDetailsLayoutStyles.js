import { StyleSheet } from 'react-native';

export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 0,
    paddingTop: 0,
  },

  // ========== HEADER SECTION ==========
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  logoBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  backButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  appTitle: {
    color: '#0F0F0F',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    maxWidth: 120,
    textAlign: 'center',
    flex: 1,
  },

  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0F0F0F',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },

  profileIconText: {
    color: '#0F0F0F',
    fontSize: 20,
    fontWeight: '700',
  },

  // ========== TITLE SECTION ==========
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 3,
    borderTopColor: '#D4AF37',
  },

  mainTitle: {
    color: '#0F0F0F',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ========== FORM CARD SECTION ==========
  formCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
    paddingLeft: 16,
    paddingBottom: 16,
  },

  cardTitle: {
    color: '#0F0F0F',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  cardSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '400',
  },
  stepUnderline: {
    height: 2,
    marginTop: 10,
    borderRadius: 2,
    backgroundColor: '#D4AF37',
  },

  // ========== DETAILS SECTION ==========
  detailsSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: '#0F0F0F',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingBottomWidth: 2,
    paddingBottomColor: '#D4AF37',
  },

  // ========== SAVE BUTTON ==========
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#0F0F0F',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },

  saveButtonText: {
    color: '#0F0F0F',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: 8,
  },

  // ========== NEXT BUTTON (Step Navigation) ==========
  nextButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  nextButtonText: {
    color: '#0F0F0F',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginRight: 8,
  },

  // ========== SKIP/GO BACK BUTTON ==========
  skipButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  skipButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: 8,
  },

  // Old styles for backward compatibility
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  submitButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  submitButtonText: {
    color: '#0F0F0F',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default layoutStyles;
