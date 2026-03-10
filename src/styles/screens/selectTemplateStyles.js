
import { StyleSheet } from 'react-native';
import COLORS from '../colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },

  titleSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  templatesContainer: {
    paddingHorizontal: 12,
  },

  templateCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
  },

  templateCardSelected: {
    borderColor: COLORS.accent,
    borderWidth: 2,
    backgroundColor: '#FAFAFA',
  },

  cardPreviewWrapper: {
    width: 120,
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  templateInfo: {
    flex: 1,
  },

  templateName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  radioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  radioButtonSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },

  bottomSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },

  continueButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },

  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});
// import { StyleSheet } from 'react-native';
// import COLORS from '../colors';

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//   },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//     backgroundColor: '#FFFFFF',
//   },

//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.text,
//   },

//   titleSection: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//   },

//   mainTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: COLORS.text,
//   },

//   subtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 4,
//   },

//   templatesContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },

//   /* 🔥 MAIN CARD (COLUMN LAYOUT FIXED) */
//   templateCard: {
//     flexDirection: 'column',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: '#DDD',
//     overflow: 'hidden',
//     elevation: 3,
//   },

//   templateCardSelected: {
//     borderColor: COLORS.accent,
//     backgroundColor: '#FAFAFA',
//   },

//   /* 🔥 PREVIEW FULL WIDTH */
//   cardPreviewWrapper: {
//     width: '100%',
//     height: 230,
//     overflow: 'hidden',
//     backgroundColor: '#FFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   /* 🔥 NAME + RADIO ROW */
//   templateBottomRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//   },

//   templateName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: COLORS.text,
//   },

//   radioButton: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     borderWidth: 2,
//     borderColor: '#DDD',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   radioButtonSelected: {
//     backgroundColor: COLORS.accent,
//     borderColor: COLORS.accent,
//   },

//   bottomSection: {
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#EEE',
//   },

//   continueButton: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.accent,
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   continueButtonDisabled: {
//     backgroundColor: '#CCCCCC',
//   },

//   continueButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//     marginRight: 8,
//   },
// });

