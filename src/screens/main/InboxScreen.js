import { useEffect, useState, useCallback, useRef } from 'react';
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

const GOLD = '#C9A227';

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
          <Ionicons name="mail-open-outline" size={46} color={GOLD} />
        </View>
      </Animated.View>
      <Text style={emptyStyles.title}>No cards received yet</Text>
      <Text style={emptyStyles.subtitle}>
        When someone shares a card with you it will appear here.
      </Text>
    </Animated.View>
  );
};

const emptyStyles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, paddingTop: 60 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FDF6E3',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5,
    borderColor: '#F3E9D2', marginBottom: 24, shadowColor: GOLD,
    shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  title:    { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 21 },
});

// ── Main screen ───────────────────────────────────────────────────────────────
function InboxScreen({ navigation }) {
  const [inbox, setInbox]                     = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [newArrivalCount, setNewArrivalCount] = useState(0);
  const [badgeScale]                          = useState(new Animated.Value(1));
  const [savingCardId, setSavingCardId]       = useState(null);

  const getOrHydrateUserId = async () => {
    const stored = await AsyncStorage.getItem('loggedInUserId');
    if (stored) return stored;

    const { res, data } = await apiFetch('/user/profile');
    if (!res.ok || data?.data?.userId == null) return null;

    const fetched = String(data.data.userId);
    await AsyncStorage.setItem('loggedInUserId', fetched);
    return fetched;
  };

  useEffect(() => {
    loadInbox();
    const unsubscribe = navigation.addListener('focus', loadInbox);
    return unsubscribe;
  }, [navigation]);

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
        setInbox((prev) => {
          const exists = prev.some(
            (i) => i.shareId && incoming.shareId && i.shareId === incoming.shareId
          );
          return exists ? prev : [incoming, ...prev];
        });
      });
    });

    return () => { if (unsubscribe) unsubscribe(); };
  }, [badgeScale]);

  const loadInbox = async () => {
    try {
      setLoading(true);
      const userId = await getOrHydrateUserId();
      if (!userId) { navigation.replace('Login'); return; }

      const { res, data } = await apiFetch(`/api/share/received`);
      if (res.status === 401) { navigation.replace('Login'); return; }
      setInbox(Array.isArray(data) ? data : []);
    } catch {
      setInbox([]);
    } finally {
      setLoading(false);
    }
  };

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
    // item.card is the nested CardInfo object from the backend
    navigation.navigate('CardDetailsScreen', { cardData: normalizeCard(item.card || {}) });
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

  const renderItem = useCallback(({ item, index }) => (
    <AnimatedCard index={index}>
      <View style={[styles.card, !item.viewedAt && styles.cardUnread]}>
        {/* Top row */}
        <TouchableOpacity style={styles.cardRow} onPress={() => handleOpen(item)} activeOpacity={0.85}>
          <View style={[styles.avatarWrap, !item.viewedAt && styles.avatarWrapUnread]}>
            <Ionicons name="person-circle" size={46} color={GOLD} />
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

          <View style={styles.metaCol}>
            <Text style={styles.time}>{formatTime(item.sharedAt)}</Text>
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
  ), [handleOpen, handleSaveContact, formatTime, getSenderName, handleSaveToCollection, savingCardId]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      {newArrivalCount > 0 && (
        <Animated.View style={[styles.liveBadge, { transform: [{ scale: badgeScale }] }]}>
          <Ionicons name="notifications" size={14} color="#fff" />
          <Text style={styles.liveBadgeText}> {newArrivalCount} new</Text>
        </Animated.View>
      )}

      <FlatList
        data={inbox}
        keyExtractor={(item, index) => String(item?.shareId ?? item?.id ?? `share-${index}`)}
        contentContainerStyle={[styles.listContent, inbox.length === 0 && styles.listContentEmpty]}
        showsVerticalScrollIndicator={false}
        onRefresh={loadInbox}
        refreshing={loading}
        onScrollBeginDrag={() => setNewArrivalCount(0)}
        renderItem={renderItem}
        removeClippedSubviews
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
  container:        { flex: 1, backgroundColor: '#FAFAFA' },
  listContent:      { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 32 },
  listContentEmpty: { flexGrow: 1 },

  card: {
    backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 16, marginBottom: 12, borderWidth: 1,
    borderColor: '#F0EADA', shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardUnread:   { borderColor: GOLD, borderWidth: 1.5, backgroundColor: '#FFFDF5' },
  cardRow:      { flexDirection: 'row', alignItems: 'center' },
  avatarWrap:   { marginRight: 12, position: 'relative' },
  avatarWrapUnread: {},
  unreadDot: {
    position: 'absolute', top: 2, right: 2, width: 10, height: 10,
    borderRadius: 5, backgroundColor: GOLD, borderWidth: 1.5, borderColor: '#fff',
  },
  info:       { flex: 1 },
  sender:     { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 3 },
  company:    { fontSize: 13, color: '#888', marginBottom: 4 },
  newBadgeWrap: { alignSelf: 'flex-start' },
  newBadge: {
    fontSize: 11, fontWeight: '700', color: '#fff', backgroundColor: GOLD,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: 'hidden',
  },
  metaCol:  { alignItems: 'flex-end', marginLeft: 8 },
  time:     { fontSize: 12, color: GOLD, fontWeight: '600' },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EADA',
  },
  actionBtnView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: 10,
    marginRight: 10,
  },
  actionBtnTextView: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  actionBtnSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF6E3',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E6D7A3',
    marginLeft: 10,
  },
  actionBtnTextSave: {
    color: GOLD,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },

  liveBadge: {
    alignSelf: 'center', marginTop: 8, marginBottom: 6, backgroundColor: GOLD,
    borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  liveBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
