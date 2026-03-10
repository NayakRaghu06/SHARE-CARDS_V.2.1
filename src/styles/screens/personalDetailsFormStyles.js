import { StyleSheet } from 'react-native';

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

  multilineInput: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },

  // Address input specific styles
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
    borderWidth: 1.5,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },

  inputFieldError: {
    borderColor: '#FF0000',
  },

  // Select dropdown
  selectDropdown: {
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F0F0F',
    backgroundColor: '#F9FAFB',
  },

  // Checkbox & radio
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  checkboxLabel: {
    marginLeft: 10,
    color: '#0F0F0F',
    fontSize: 14,
    fontWeight: '400',
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

  // Form group (multiple inputs)
  formGroup: {
    marginBottom: 20,
  },

  // Row layout for side-by-side inputs
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  formRowItem: {
    flex: 0.48,
  },

  // Disabled state
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },

  // Character counter
  characterCounter: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});

export default formStyles;
