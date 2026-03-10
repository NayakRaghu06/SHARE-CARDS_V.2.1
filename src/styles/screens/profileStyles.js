import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.accent,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  headerTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Avatar styles
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  avatarText: {
    color: COLORS.primary,
    fontSize: 40,
    fontWeight: '700',
  },

  // Card styles
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Field wrapper
  fieldWrapper: {
    marginBottom: 20,
  },

  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  fieldLabel: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  fieldValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    paddingHorizontal: 8,
  },

  // Edit input
  editInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },

  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  // Button container
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },

  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  saveButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Options container
  optionsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  optionItemLast: {
    borderBottomWidth: 0,
  },

  optionText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 16,
    flex: 1,
  },

  // Logout button
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#FF0000',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  logoutButtonText: {
    color: '#FF0000',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
});

export default profileStyles;
