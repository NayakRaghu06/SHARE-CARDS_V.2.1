import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 30,
  },
  // Template Selection Styles
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },


  /* 🔥 TEMPLATE CARD */
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    elevation: 3,
  },


  templateCardSelected: {
    borderColor: '#D4AF37',
    borderWidth: 3,
  },
  cardPreviewWrapper: {
    padding: 12,
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },

  /* 🔥 FIXED HEIGHT (NO aspectRatio) */
  cardPreviewWrapper: {
  padding: 12,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F9FAFB',
},

  /* 🔥 NAME + RADIO ROW */

  templateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,

    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F1F1F',
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,

    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  templateName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F1F1F',
  },

  radioButton: {
    width: 26,
    height: 26,
    borderRadius: 13,

    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  radioButtonSelected: {
    borderColor: '#D4AF37',
    backgroundColor: '#D4AF37',
  },

  bottomSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },

  continueButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  continueButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },


  continueButtonDisabled: {
    backgroundColor: '#D0D0D0',
    opacity: 0.6,
  },

  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  saveButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.buttonText,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default styles;



