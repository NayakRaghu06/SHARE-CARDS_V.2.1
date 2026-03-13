import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';

export const businessDetailsStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  /* FIELD WRAPPER */
  fieldWrapper: {
    marginBottom: 20,
  },

  /* LABEL ROW */
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  labelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },

  star: {
    color: '#FF0000',
    fontWeight: '700',
    fontSize: 16,
  },

  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF0000',
  },

  /* INPUT FIELD */
  input: {
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  inputIcon: {
    marginRight: 10,
    color: '#D4AF37',
  },
  inputIconMultiline: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },

  inputFilled: {
    backgroundColor: '#FFFFFF',
  },

  inputFocused: {
    borderColor: '#D4AF37',
    borderWidth: 1.5,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },

  inputError: {
    borderColor: '#FF0000',
    borderWidth: 1.5,
  },

  multilineInput: {
    paddingTop: 12,
    height: 110,
    textAlignVertical: 'top',
  },

  /* PDF BUTTON */
  pdfButton: {
    backgroundColor: '#F8F9FB',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  pdfButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
    marginLeft: 10,
  },

  /* PDF FILE INFO */
  pdfFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },

  pdfFileName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#15803d',
    marginLeft: 8,
    flex: 1,
  },

  /* LOGO PREVIEW */
  logoPreviewContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },

  logoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
  },

  logoInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoFileName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#15803d',
    marginLeft: 8,
  },

  /* BUTTON CONTAINER */
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
});

// Keep old exports for backward compatibility
export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
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

export const formStyles = StyleSheet.create({
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
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
    color: '#D4AF37',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F0F0F',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  addressInputContainer: {
    height: 120,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F0F0F',
    paddingVertical: 8,
    paddingHorizontal: 0,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addressIcon: {
    marginRight: 12,
    marginTop: 8,
  },
  inputFocused: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  inputFieldError: {
    borderColor: '#FF0000',
  },
  errorMessage: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  helperText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F0F0F',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F0F0F',
  },
  fileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
    height: 60,
  },
  fileInputContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 12,
  },
  fileInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D4AF37',
  },
  fileInputValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
});

export default layoutStyles;
