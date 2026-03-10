import { StyleSheet } from 'react-native';

const GOLD   = '#C9A227';
const GOLD_BG = '#FDF8EC';
const TEXT   = '#111827';
const TEXT_2 = '#6B7280';
const BORDER = '#E5E7EB';
const BG     = '#F5F6F8';
const WHITE  = '#FFFFFF';

export const contactsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GOLD_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: 0.2,
  },
  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },

  // ── Search bar ────────────────────────────────────────────────────────────
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    height: 46,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: TEXT,
  },

  // ── Loading / permission ──────────────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 14,
    color: TEXT_2,
    marginTop: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 13,
    color: TEXT_2,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: GOLD,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: WHITE,
  },

  // ── Add contact form ──────────────────────────────────────────────────────
  formContainer: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_2,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: TEXT,
    backgroundColor: '#FAFAFA',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_2,
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: GOLD,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: WHITE,
  },

  // ── Section headers ───────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: GOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    flex: 1,
  },
  sectionTitleOther: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    flex: 1,
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_2,
    backgroundColor: BORDER,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },

  // ── Contact lists ─────────────────────────────────────────────────────────
  contactsList: {
    gap: 8,
    marginBottom: 8,
  },

  // ── DBC contact card ──────────────────────────────────────────────────────
  contactItemDBC: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0E6C8',
    shadowColor: GOLD,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // ── Other contact card ────────────────────────────────────────────────────
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // ── Avatar ────────────────────────────────────────────────────────────────
  avatarDBC: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GOLD_BG,
    borderWidth: 1.5,
    borderColor: '#E8D08A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarOther: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: GOLD,
  },
  avatarTextOther: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_2,
  },

  // ── Contact info ──────────────────────────────────────────────────────────
  contactInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT,
  },
  dbcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: GOLD_BG,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8D08A',
    gap: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: GOLD,
  },
  contactPhone: {
    fontSize: 13,
    color: TEXT_2,
  },
  contactEmail: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  cardType: {
    fontSize: 11,
    color: GOLD,
    marginTop: 3,
    fontWeight: '600',
  },

  // ── Delete icon ───────────────────────────────────────────────────────────
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 72,
    gap: 12,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    color: TEXT_2,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 20,
  },
  // legacy key kept so any lingering ref doesn't crash
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
});
