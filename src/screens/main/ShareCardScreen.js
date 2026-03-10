import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ScrollView,
  Share,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch, getApiErrorMessage } from '../../utils/api';
import websocketService from '../../utils/websocketService';
import AppHeader from '../../components/common/AppHeader';

const GOLD = '#C9A227';
const GOLD_LIGHT = '#E6D7A3';
const GOLD_BG = '#FDF6E3';

// â”€â”€ Finds the first numeric ID field in any object regardless of field name â”€â”€
function extractId(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const known = obj.cardId ?? obj.card_id ?? obj.id ?? obj.cardID ?? obj.CardId;
  if (known != null && !isNaN(Number(known))) return Number(known);
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase().endsWith('id') && obj[key] != null && !isNaN(Number(obj[key]))) {
      return Number(obj[key]);
    }
  }
  return null;
}

export default function ShareCardScreen({ navigation, route }) {
  const cardData = route?.params?.cardData || {};

  const parsePositiveNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const extractCardIdDeep = (node) => {
    if (!node || typeof node !== 'object') return null;

    const direct =
      parsePositiveNumber(node.cardId) ??
      parsePositiveNumber(node.businessCardId) ??
      parsePositiveNumber(node.card_id) ??
      parsePositiveNumber(node.business_card_id);
    if (direct) return direct;

    if (Array.isArray(node)) {
      for (const item of node) {
        const fromItem = extractCardIdDeep(item);
        if (fromItem) return fromItem;
      }
      return null;
    }

    for (const [key, value] of Object.entries(node)) {
      if (key.toLowerCase().includes('card')) {
        const nested = extractCardIdDeep(value);
        if (nested) return nested;
      }
    }

    for (const value of Object.values(node)) {
      const nested = extractCardIdDeep(value);
      if (nested) return nested;
    }

    return null;
  };

  const normalizeCardsPayload = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.cards)) return payload.cards;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.data?.cards)) return payload.data.cards;
    if (Array.isArray(payload?.data?.content)) return payload.data.content;
    if (payload && typeof payload === 'object') return [payload];
    return [];
  };

  const looksSameCard = (a, b) => {
    const aName = String(a?.name || '').trim().toLowerCase();
    const bName = String(b?.name || '').trim().toLowerCase();
    const aPhone = String(a?.phoneNumber ?? a?.phone ?? '').replace(/\D/g, '');
    const bPhone = String(b?.phoneNumber ?? b?.phone ?? '').replace(/\D/g, '');
    const nameMatch = aName && bName && aName === bName;
    const phoneMatch = aPhone && bPhone && aPhone === bPhone;
    return nameMatch || phoneMatch;
  };

  const extractCardId = (obj) => {
    if (!obj || typeof obj !== 'object') return null;

    const explicit =
      parsePositiveNumber(route?.params?.cardId) ??
      parsePositiveNumber(obj.cardId) ??
      parsePositiveNumber(obj.id) ??
      parsePositiveNumber(obj.businessCardId) ??
      parsePositiveNumber(obj.business_card_id) ??
      parsePositiveNumber(obj.cardID) ??
      parsePositiveNumber(obj.card_id);
    if (explicit) return explicit;

    const nestedCard = obj.card || obj.businessCard || obj.cardDetails || obj.cardDto;
    if (nestedCard && typeof nestedCard === 'object') {
      const nested = extractCardId(nestedCard);
      if (nested) return nested;
    }

    return null;
  };

  const resolveCardId = async () => {
    const fromRoute = extractCardId({ ...cardData, cardId: route?.params?.cardId });
    if (fromRoute) return fromRoute;

    const { res, data } = await apiFetch('/api/cards/view-cards');
    if (!res.ok) {
      console.log('[Share In App] view-cards status:', res.status);
      return null;
    }

    const list = normalizeCardsPayload(data);

    if (!Array.isArray(list) || list.length === 0) {
      console.log('[Share In App] view-cards payload:', JSON.stringify(data));
      return null;
    }

    let fromApi = null;
    for (const item of list) {
      if (looksSameCard(item, cardData)) {
        fromApi = extractCardId(item) || extractCardIdDeep(item);
        if (fromApi) break;
      }
    }

    if (!fromApi) {
      for (const item of list) {
        fromApi = extractCardId(item) || extractCardIdDeep(item);
        if (fromApi) break;
      }
    }

    if (fromApi) return fromApi;

    console.log('[Share In App] unable to extract cardId from list payload');
    return null;
  };

  const [mobileNumber, setMobileNumber] = useState('');
  const [userFound, setUserFound]       = useState(null); // null | true | false
  const [userData, setUserData]         = useState(null);
  const [loading, setLoading]           = useState(false);

  const [cardId, setCardId] = useState(() => extractId(cardData));

  useEffect(() => {
    console.log('[ShareCardScreen] cardData received:', JSON.stringify(cardData));
    console.log('[ShareCardScreen] resolved cardId (layer 1):', extractId(cardData));
  }, []);

  useEffect(() => {
    if (cardId) return;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem('activeCardId');
        console.log('[ShareCardScreen] activeCardId from storage:', stored);
        if (stored && !isNaN(Number(stored))) {
          setCardId(Number(stored));
          return;
        }

        const { res, data } = await apiFetch('/api/cards/view-cards');
        console.log('[ShareCardScreen] view-cards response:', JSON.stringify(data));
        if (res.ok && Array.isArray(data) && data.length > 0) {
          const id = extractId(data[0]);
          console.log('[ShareCardScreen] resolved cardId (layer 3):', id);
          if (id) setCardId(id);
        }
      } catch (e) {
        console.warn('[ShareCardScreen] cardId fallback failed:', e);
      }
    })();
  }, [cardId]);

  const APP_LINK = 'https://sharecards.in';
  const inviteMessage =
    `Hey! I'm using Digital Business Card (DBC) to share my professional profile instantly.\nCreate your card and connect with me here:\n${APP_LINK}`;

  // â”€â”€ GET /api/share/check-user â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCheckUser = async () => {
    setLoading(true);
    try {
      const { res, data } = await apiFetch(
        `/api/share/check-user?mobileNumber=${mobileNumber}`
      );
      if (res.status === 401) { navigation.replace('Login'); return; }

      if (res.ok && data?.exists) {
        setUserData(data);
        setUserFound(true);
      } else {
        setUserData(null);
        setUserFound(false);
      }
    } catch (e) {
      Alert.alert('Error', e?.message || 'Failed to check user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // â”€â”€ POST /api/share â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleShareInApp = async () => {
    try {
      const senderId = await AsyncStorage.getItem('loggedInUserId');
      if (!senderId) { navigation.replace('Login'); return; }
      if (!cardId) { Alert.alert('Error', 'Card ID is missing. Please try again.'); return; }

      const payload = {
        senderId: Number(senderId),
        receiverMobile: Number(mobileNumber),
        cardId: Number(cardId),
      };

      console.log('[ShareInApp] payload:', JSON.stringify(payload));

      const { res, data } = await apiFetch('/api/share', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('[ShareInApp] status:', res.status, '| response:', JSON.stringify(data));

      if (res.status === 401) { navigation.replace('Login'); return; }

      if (res.ok) {
        const receiverId = userData?.userId ?? userData?.id;
        if (receiverId) {
          await websocketService.connect(senderId);
          websocketService.sendShareCard({
            senderId: Number(senderId),
            receiverId: Number(receiverId),
            card: cardData,
          });
        }
        Alert.alert('Shared!', 'Card shared successfully.');
      } else {
        const msg = getApiErrorMessage(res, data, 'Failed to share card');
        console.warn('[ShareInApp] backend error:', msg);
        Alert.alert('Error', msg);
      }
    } catch (e) {
      console.warn('[ShareInApp] catch:', e);
      Alert.alert('Error', e?.message || 'Failed to share card.');
    }
  };

  // â”€â”€ POST /api/share/whatsapp â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleShareWhatsApp = async () => {
    // If user is not on the app, fall back to an invite message
    if (!userFound) {
      const url = `https://wa.me/91${mobileNumber}?text=${encodeURIComponent(inviteMessage)}`;
      try {
        await Linking.openURL(url);
      } catch {
        Alert.alert('WhatsApp Not Found', 'Could not open WhatsApp.');
      }
      return;
    }

    try {
      const senderId = await AsyncStorage.getItem('loggedInUserId');
      if (!senderId) { navigation.replace('Login'); return; }
      if (!cardId) { Alert.alert('Error', 'Card ID is missing. Please try again.'); return; }

      const { res, data } = await apiFetch('/api/share/whatsapp', {
        method: 'POST',
        body: JSON.stringify({
          senderId: Number(senderId),
          receiverMobile: Number(mobileNumber),
          cardId: Number(cardId),
        }),
      });

      if (res.status === 401) { navigation.replace('Login'); return; }
      if (!res.ok) {
        Alert.alert('Error', getApiErrorMessage(res, data, 'Could not generate WhatsApp link'));
        return;
      }

      const url = data?.whatsappUrl;
      if (url) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', getApiErrorMessage(res, data, 'Could not get WhatsApp link.'));
      }
    } catch (e) {
      Alert.alert('Error', e?.message || 'Unable to open WhatsApp.');
    }
  };

  // â”€â”€ Share invite via system share sheet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleInviteShare = async () => {
    try {
      await Share.share({ message: inviteMessage });
    } catch {
      Alert.alert('Error', 'Unable to open share sheet.');
    }
  };

  const isValidMobile = mobileNumber.length === 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* â”€â”€ SECTION 1: Mobile Input â”€â”€ */}
        <Text style={styles.sectionLabel}>Enter Mobile Number</Text>

        <View style={styles.inputWrapper}>
          <View style={styles.countryBox}>
            <Text style={styles.countryText}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="10 digit mobile number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobileNumber}
            onChangeText={(t) => {
              setMobileNumber(t);
              setUserFound(null);
              setUserData(null);
            }}
          />
        </View>

        <TouchableOpacity
          style={[styles.checkBtn, (!isValidMobile || loading) && styles.checkBtnDisabled]}
          onPress={handleCheckUser}
          activeOpacity={0.85}
          disabled={!isValidMobile || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.checkBtnText}>Check User</Text>
          )}
        </TouchableOpacity>

        {/* â”€â”€ SECTION 2: User Found / Not Found Status â”€â”€ */}
        {userFound === true && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.successBannerText}>  User Found!</Text>
          </View>
        )}

        {userFound === false && (
          <>
            <View style={styles.errorBanner}>
              <Ionicons name="close-circle" size={20} color="#DC2626" />
              <Text style={styles.errorBannerText}>  User Not Found on ShareCards</Text>
            </View>
            <TouchableOpacity
              style={styles.recipientBtn}
              onPress={() =>
                navigation.navigate('RecipientDetailsScreen', {
                  cardId,
                  cardData,
                  prefillMobile: mobileNumber,
                })
              }
              activeOpacity={0.85}
            >
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <Text style={styles.recipientBtnText}>  Enter Recipient Details</Text>
            </TouchableOpacity>
          </>
        )}

        {/* â”€â”€ SECTION 3: User Preview Card â”€â”€ */}
        {userFound === true && userData && (
          <View style={styles.userCard}>
            {userData.profilePhoto ? (
              <Image
                source={{ uri: userData.profilePhoto }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>?</Text>
              </View>
            )}

            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {userData.name || `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim() || 'Unknown'}
              </Text>
              {userData.email ? (
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={13} color={GOLD} />
                  <Text style={styles.infoText} numberOfLines={1}>{userData.email}</Text>
                </View>
              ) : null}
              {userData.mobileNumber ? (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={13} color={GOLD} />
                  <Text style={styles.infoText}>{userData.mobileNumber}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* â”€â”€ SECTION 4 & 5: Share Options â”€â”€ */}
        {userFound === true && (
          <>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>Choose Share Option</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Share In App â€” enabled only when user exists */}
            <TouchableOpacity
              style={[styles.shareBtn, styles.shareBtnGold]}
              onPress={handleShareInApp}
              activeOpacity={0.85}
            >
              <Ionicons name="phone-portrait-outline" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Share In App</Text>
            </TouchableOpacity>

            {/* Share on WhatsApp â€” always enabled; invite flow when user not found */}
            <TouchableOpacity
              style={[styles.shareBtn, styles.shareBtnWhatsApp]}
              onPress={handleShareWhatsApp}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>
                {userFound ? '  Share on WhatsApp' : '  Invite on WhatsApp'}
              </Text>
            </TouchableOpacity>
          </>
        )}


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // â”€â”€ Scroll
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },

  // â”€â”€ Section Label
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },

  // â”€â”€ Mobile Input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: GOLD_LIGHT,
    marginBottom: 16,
    overflow: 'hidden',
  },
  countryBox: {
    backgroundColor: GOLD_BG,
    paddingHorizontal: 14,
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: GOLD_LIGHT,
  },
  countryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 15,
    fontSize: 16,
    color: '#111',
  },

  // â”€â”€ Check User Button
  checkBtn: {
    backgroundColor: GOLD,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  checkBtnDisabled: {
    backgroundColor: '#D4C07A',
    elevation: 0,
    shadowOpacity: 0,
  },
  checkBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  // â”€â”€ Status Banners
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  successBannerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorBannerText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },

  // â”€â”€ User Preview Card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: GOLD_LIGHT,
    shadowColor: GOLD,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    borderWidth: 2,
    borderColor: GOLD_LIGHT,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: GOLD_BG,
    borderWidth: 2,
    borderColor: GOLD_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarPlaceholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: GOLD,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },

  // â”€â”€ Recipient Details Button (user not found CTA)
  recipientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    height: 50,
    borderRadius: 12,
    marginTop: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  recipientBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // â”€â”€ Divider row
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: GOLD_LIGHT,
  },
  dividerLabel: {
    marginHorizontal: 10,
    fontWeight: '600',
    color: '#555',
    fontSize: 13,
  },

  // â”€â”€ Share Buttons
  shareBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  shareBtnGold: {
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  shareBtnWhatsApp: {
    backgroundColor: '#25D366',
    shadowColor: '#25D366',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  shareBtnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: GOLD_LIGHT,
    elevation: 0,
    shadowOpacity: 0,
  },
  shareBtnDisabled: {
    backgroundColor: '#D4C07A',
    elevation: 0,
    shadowOpacity: 0,
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
