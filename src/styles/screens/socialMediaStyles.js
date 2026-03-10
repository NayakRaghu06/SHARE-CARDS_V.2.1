import { StyleSheet } from 'react-native';

// ========== LAYOUT STYLES ==========
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
    paddingHorizontal: 16,
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

  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  appTitle: {
    color: '#0F0F0F',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    maxWidth: 120,
    textAlign: 'center',
    flex: 1,
  },

  stepIndicator: {
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

  stepText: {
    color: '#0F0F0F',
    fontSize: 22,
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
  },

  // ========== UPLOAD BOX ==========
  uploadBox: {
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadContent: {
    alignItems: 'center',
  },

  uploadLabel: {
    color: '#0F0F0F',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },

  uploadHint: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '400',
  },

  uploadedImage: {
    marginTop: 12,
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },

  uploadedImagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },

  // Logo specific preview (maintain aspect ratio)
  uploadedImageLogo: {
    marginTop: 12,
    width: '100%',
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadedImageLogoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  // ========== BUTTON GROUP ==========
  buttonGroup: {
    gap: 12,
    marginTop: 24,
  },

  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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

  skipButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  skipButtonText: {
    color: '#D4AF37',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: 8,
  },
});

// ========== FORM STYLES ==========
export const formStyles = StyleSheet.create({
  // Input wrapper
  inputWrapper: {
    marginBottom: 18,
  },

  label: {
    color: '#0F0F0F',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FB',
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  inputContainerFilled: {
    backgroundColor: '#FFFFFF',
  },

  inputIcon: {
    marginRight: 10,
    color: '#D4AF37',
  },

  // Input field
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F0F0F',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },

  inputFocused: {
    borderColor: '#D4AF37',
    borderWidth: 1.5,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },

  inputFieldError: {
    borderColor: '#FF0000',
  },

  // Error message
  errorMessage: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },

  // Helper text
  helperText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
  },
});

export default layoutStyles;
