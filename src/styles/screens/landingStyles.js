import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';
import { SPACING, RADIUS, SHADOW } from '../globalStyles';

export const landingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ========== HEADER SECTION ==========
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    ...SHADOW.sm,
  },

  menuButton: {
    padding: SPACING.sm,
  },

  profileButton: {
    padding: SPACING.xs,
  },

  // ========== SEARCH SECTION ==========
  searchSection: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.sm,
    ...SHADOW.xs,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    padding: 0,
    margin: 0,
  },

  // ========== CONTACTS LIST SECTION ==========
  contactsListContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },

  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginVertical: 6,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOW.xs,
  },

  contactInfo: {
    flex: 1,
  },

  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },

  contactCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    gap: 4,
  },

  contactCategoryText: {
    fontSize: 12,
    color: COLORS.accentDark,
    fontWeight: '600',
  },

  // ========== EMPTY STATE ==========
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: SPACING.xl,
  },

  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xxl,
  },

  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.base,
    marginBottom: SPACING.xl,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ========== ACTION CONTAINER ==========
  actionContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.background,
  },

  createButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    width: '100%',
    alignSelf: 'center',
    ...SHADOW.gold,
  },

  createButtonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    marginTop: SPACING.md,
  },

  secondaryButtonText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '700',
  },

  // ========== FOOTER TABS ==========
  footerTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingBottom: 8,
    paddingTop: 4,
    ...SHADOW.sm,
  },

  footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  footerTabActive: {
    borderTopWidth: 2,
    borderTopColor: COLORS.accent,
  },

  footerTabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginTop: 3,
  },

  footerTabLabelActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
});

export default landingStyles;
