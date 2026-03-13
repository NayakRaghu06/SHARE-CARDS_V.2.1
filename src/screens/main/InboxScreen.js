import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useInbox } from '../../context/InboxContext';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, saveCard } from '../../utils/api';
import websocketService from '../../utils/websocketService';
import AppHeader from '../../components/common/AppHeader';
import AnimatedCard from '../../components/common/AnimatedCard';
import FS from '../../styles/typography';

const GOLD = '#D4AF37';

// ── Normalize card fields so shareVCard + CardDetailsScreen both work ─────────
// Backend returns: phoneNumber, whatsappUrl, businessSubcategory
// Templates/vCard expect: phone, whatsapp, businessSubCategory
const normalizeCard = (card = {}) => ({
  ...card,
  phone: card.phone || card.phoneNumber || card.mobile || '',
  whatsapp: card.whatsapp || card.whatsappUrl || '',
  businessSubCategory: card.businessSubCategory || card.businessSubcategory || '',
  businessDescription: card.businessDescription || card.description || '',
});

// ── Animated empty state ──────────────────────────────────────────────────────
const EmptyState = () => {
  const bounce  = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -10, duration: 1400, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0,   duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [bounce, opacity]);

  return (
    <Animated.View style={[emptyStyles.wrap, { opacity }]}>
      <Animated.View style={{ transform: [{ translateY: bounce }] }}>
        <View style={emptyStyles.iconCircle}>
          <Ionicons name="mail-open-outline" size={46} color="#CBD5E1" />
        </View>
      </Animated.View>
      <Text style={emptyStyles.title}>No shared cards yet</Text>
      <Text style={emptyStyles.subtitle}>
        When someone shares a card with you it will appear here.
      </Text>
    </Animated.View>
  );
};

const emptyStyles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, paddingTop: 60 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5,
    borderColor: '#E2E8F0', marginBottom: 24,
  },
  title:    { fontSize: FS.h4, fontWeight: '700', color: '#94A3B8', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: FS.md, color: '#94A3B8', textAlign: 'center', lineHeight: 21 },
});

// ── Main screen ───────────────────────────────────────────────────────────────
function InboxScreen({ navigation }) {
  const [inbox, setInbox]                     = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [refreshing, setRefreshing]           = useState(false);
  const [newArrivalCount, setNewArrivalCount] = useState(0);
  const [badgeScale]                          = useState(new Animated.Value(1));
  const [savingCardId, setSavingCardId]       = useState(null);

  const { setUnreadInboxCount } = useInbox();
  const inboxLengthRef = useRef(0);

  const getOrHydrateUserId = async () => {
    const stored = await AsyncStorage.getItem('loggedInUserId');
    if (stored) return stored;

    const { res, data } = await apiFetch('/user/profile');
    if (!res.ok || data?.data?.userId == null) return null;

    const fetched = String(data.data.userId);
    await AsyncStorage.setItem('loggedInUserId', fetched);
    return fetched;
  };

  const loadInbox = useCallback(async () => {
    try {
      setInbox([]);
      setLoading(true);

      const userId = await getOrHydrateUserId();
      if (!userId) { navigation.replace('Login'); return; }

      const { res, data } = await apiFetch('/api/share/received');
      if (res.status === 401) { navigation.replace('Login'); return; }

      const raw = Array.isArray(data) ? data.filter((i) => i?.shareId != null && i?.card != null) : [];
      const sorted = [...raw].sort((a, b) => {
        const aUnread = !a.viewedAt;
        const bUnread = !b.viewedAt;
        if (aUnread !== bUnread) return aUnread ? -1 : 1;
        return new Date(b.sharedAt) - new Date(a.sharedAt);
      });
      inboxLengthRef.current = sorted.length;
      setInbox(sorted);
    } catch {
      setInbox([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  // Reload data + reset badge every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setUnreadInboxCount(0);
      loadInbox();
    }, [loadInbox, setUnreadInboxCount])
  );

  // Real-time inbox via WebSocket
  useEffect(() => {
    let unsubscribe = null;

    getOrHydrateUserId().then(async (userId) => {
      if (!userId) return;
      await websocketService.connect(userId);
      unsubscribe = websocketService.subscribeToInbox((payload) => {
        const incoming = payload?.data || payload;
        if (!incoming) return;

        Animated.sequence([
          Animated.spring(badgeScale, { toValue: 1.2, useNativeDriver: true }),
          Animated.spring(badgeScale, { toValue: 1,   useNativeDriver: true }),
        ]).start();

        setNewArrivalCount((prev) => prev + 1);
        if (!incoming?.shareId || !incoming?.card) return;
        setInbox((prev) => {
          const exists = prev.some((i) => i.shareId === incoming.shareId);
          return exists ? prev : [incoming, ...prev];
        });
      });
    });

    return () => { if (unsubscribe) unsubscribe(); };
  }, [badgeScale]);

  // Polling fallback — only fires when WebSocket is not connected
  useEffect(() => {
    const interval = setInterval(() => {
      if (!websocketService.isConnected()) loadInbox();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Open → mark viewed → navigate to card detail
  const handleOpen = useCallback(async (item) => {
    if (!item.viewedAt) {
      try {
        await apiFetch(`/api/share/view/${item.shareId}`, { method: 'PUT' });
        // Optimistically mark as read locally
        setInbox((prev) =>
          prev.map((i) =>
            i.shareId === item.shareId ? { ...i, viewedAt: new Date().toISOString() } : i
          )
        );
      } catch { /* non-blocking */ }
    }
    navigation.navigate('CardDetailsScreen', {
      cardData: item?.card ? normalizeCard(item.card) : null,
    });
  }, [navigation]);

  // Save contact → normalize card fields before passing to vCard generator
  const handleSaveContact = useCallback(async (item) => {
    const card = normalizeCard(item.card);
    if (!card) {
      Alert.alert('Error', 'No card data available to save.');
      return;
    }

    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Contact permission is needed to save contact.');
        return;
      }

      await Contacts.addContactAsync({
        [Contacts.Fields.FirstName]: card.name || 'Unknown',
        [Contacts.Fields.Company]: card.companyName || '',
        [Contacts.Fields.JobTitle]: card.designation || '',
        [Contacts.Fields.PhoneNumbers]: card.phone
          ? [{ label: 'mobile', number: card.phone }]
          : [],
        [Contacts.Fields.Emails]: card.email
          ? [{ label: 'work', email: card.email }]
          : [],
      });

      Alert.alert('Success', 'Contact saved to phone contacts.');
    } catch (error) {
      console.warn('[InboxSaveContact] error', error);
      Alert.alert('Error', 'Failed to save contact.');
    }
  }, []);

  // Save card to app collection (POST /api/save-card)
  // const handleSaveToCollection = useCallback(async (item) => {
  //   const cardId = item?.card?.cardId;
  //   if (!cardId) { Alert.alert('Error', 'Card ID missing.'); return; }
  //   try {
  //     const { res, data } = await apiFetch('/api/save-card', {
  //       method: 'POST',
  //       body: JSON.stringify({ cardId: Number(cardId) }),
  //     });
  //     if (res.ok) {
  //       Alert.alert('Saved!', 'Card added to your My Cards collection.');
  //     } else if (res.status === 409) {
  //       Alert.alert('Already Saved', 'This card is already in your collection.');
  //     } else {
  //       Alert.alert('Error', data?.message || 'Could not save card.');
  //     }
  //   } catch (e) {
  //     Alert.alert('Error', e?.message || 'Could not save card.');
  //   }
  // }, []);

  const formatTime = useCallback((iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }, []);

  // Derive display name from sender fields
  const getSenderName = useCallback((item) => {
    const first = item.senderFirstName || '';
    const last  = item.senderLastName  || '';
    const full  = `${first} ${last}`.trim();
    return full || 'Unknown Sender';
  }, []);

  const handleSaveToCollection = useCallback(async (item) => {
    const cardId = item?.card?.cardId ?? item?.card?.id;
    if (!cardId) {
      Alert.alert('Error', 'Card ID missing.');
      return;
    }

    setSavingCardId(cardId);
    try {
      const { res, data } = await saveCard(cardId);
      if (res.status === 401) {
        navigation.replace('Login');
        return;
      }
      if (res.ok) {
        Alert.alert('Saved!', 'Card added to your My Cards collection.');
      } else if (res.status === 409) {
        Alert.alert('Already Saved', 'This card is already in your collection.');
      } else {
        Alert.alert('Error', data?.message || 'Could not save card.');
      }
    } catch (e) {
      Alert.alert('Error', e?.message || 'Could not save card.');
    } finally {
      setSavingCardId(null);
    }
  }, [navigation]);

  const renderItem = useCallback(({ item, index }) => {
    if (!item?.card) return null;
    return (
    <AnimatedCard index={index}>
      <View style={[styles.card, !item.viewedAt && styles.cardUnread]}>
        {/* Top row */}
        <TouchableOpacity style={styles.cardRow} onPress={() => handleOpen(item)} activeOpacity={0.85}>
          <View style={[styles.avatarWrap, !item.viewedAt && styles.avatarWrapUnread]}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={24} color="#D4AF37" />
            </View>
            {!item.viewedAt && <View style={styles.unreadDot} />}
          </View>

          <View style={styles.info}>
            <Text style={styles.sender} numberOfLines={1}>{getSenderName(item)}</Text>
            {item.senderCompany ? (
              <Text style={styles.company} numberOfLines={1}>{item.senderCompany}</Text>
            ) : null}
            {!item.viewedAt && (
              <View style={styles.newBadgeWrap}>
                <Text style={styles.newBadge}>New</Text>
              </View>
            )}
          </View>

        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtnView} onPress={() => handleOpen(item)} activeOpacity={0.85}>
            <Ionicons name="eye-outline" size={16} color="#fff" />
            <Text style={styles.actionBtnTextView}>View Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnSave} onPress={() => handleSaveContact(item)} activeOpacity={0.85}>
            <Ionicons name="person-add-outline" size={16} color={GOLD} />
            <Text style={styles.actionBtnTextSave}>Save Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedCard>
  );
  }, [handleOpen, handleSaveContact, formatTime, getSenderName, handleSaveToCollection, savingCardId]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <View style={styles.titleWrap}>
        <Text style={styles.screenTitle}>  </Text>
      </View>
      {newArrivalCount > 0 && (
        <Animated.View style={[styles.liveBadge, { transform: [{ scale: badgeScale }] }]}>
          <Ionicons name="notifications" size={14} color="#fff" />
          <Text style={styles.liveBadgeText}> {newArrivalCount} new</Text>
        </Animated.View>
      )}

      <FlatList
        data={inbox}
        keyExtractor={(item, index) => item?.shareId?.toString() ?? String(index)}
        contentContainerStyle={[styles.listContent, inbox.length === 0 && styles.listContentEmpty]}
        showsVerticalScrollIndicator={false}
        onRefresh={loadInbox}
        refreshing={refreshing}
        onScrollBeginDrag={() => setNewArrivalCount(0)}
        renderItem={renderItem}
        extraData={inbox}
        removeClippedSubviews={false}
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={5}
        ListEmptyComponent={!loading ? <EmptyState /> : null}
      />
    </SafeAreaView>
  );
}

export default InboxScreen;

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F8FAFC' },
  listContent:      { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  listContentEmpty: { flexGrow: 1 },

  titleWrap: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  screenTitle: {
    fontSize: FS.h3,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  titleAccent: {
    height: 3,
    width: 40,
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },

  card: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    overflow: 'hidden',
  },
  cardUnread:       { borderWidth: 1.5, borderColor: GOLD },
  cardRow:          { flexDirection: 'row', alignItems: 'center', padding: 18 },
  avatarWrap:       { marginRight: 14, position: 'relative' },
  avatarWrapUnread: {},
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute', top: 0, right: 0, width: 10, height: 10,
    borderRadius: 5, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#0F172A',
  },
  info:         { flex: 1 },
  sender:       { fontSize: FS.xl, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  company:      { fontSize: FS.base, color: '#CBD5E1', marginTop: 2, marginBottom: 4 },
  newBadgeWrap: { alignSelf: 'flex-start', marginTop: 4 },
  newBadge: {
    fontSize: FS.xs, fontWeight: '600', color: '#FFFFFF', backgroundColor: '#EF4444',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, overflow: 'hidden',
  },
  metaCol: { alignItems: 'flex-end', marginLeft: 8 },
  time:    { fontSize: FS.sm, color: '#94A3B8', fontWeight: '500' },

  actionRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  actionBtnView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    paddingVertical: 13,
  },
  actionBtnTextView: {
    color: '#FFFFFF',
    fontSize: FS.md,
    fontWeight: '700',
    marginLeft: 6,
  },
  actionBtnSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  actionBtnTextSave: {
    color: GOLD,
    fontSize: FS.md,
    fontWeight: '700',
    marginLeft: 6,
  },

  liveBadge: {
    alignSelf: 'center', marginTop: 6, marginBottom: 4, backgroundColor: GOLD,
    borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  liveBadgeText: { color: '#FFFFFF', fontSize: FS.sm, fontWeight: '700' },
});
