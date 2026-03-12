import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Modal, Animated, Dimensions, PanResponder } from 'react-native';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = SW * 0.86;
const CARD_H = SH * 0.30;

// â”€â”€â”€ Premium 3D floating card â€” float animation (native driver) +
//     tilt via PanResponder (JS driver, separate Animated.View layer)
const FloatingCard = React.memo(() => {
  // Native-driver: smooth float loop
  const floatAnim = useRef(new Animated.Value(0)).current;
  // JS-driver: tilt + scale (driven by PanResponder, must stay on JS)
  const tiltX   = useRef(new Animated.Value(0)).current;
  const tiltY   = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -14, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,   duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,

      onPanResponderGrant: () => {
        Animated.spring(scaleAnim, {
          toValue: 1.06, useNativeDriver: false, tension: 60, friction: 6,
        }).start();
      },

      onPanResponderMove: (_, gs) => {
        // map finger drag â†’ tilt degrees (clamped internally via interpolate)
        tiltY.setValue(gs.dx / 7);
        tiltX.setValue(-gs.dy / 7);
      },

      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(tiltX,    { toValue: 0, useNativeDriver: false, tension: 50, friction: 6 }),
          Animated.spring(tiltY,    { toValue: 0, useNativeDriver: false, tension: 50, friction: 6 }),
          Animated.spring(scaleAnim,{ toValue: 1, useNativeDriver: false, tension: 50, friction: 6 }),
        ]).start();
      },
    })
  ).current;

  const rotateX = tiltX.interpolate({ inputRange: [-18, 18], outputRange: ['-18deg', '18deg'], extrapolate: 'clamp' });
  const rotateY = tiltY.interpolate({ inputRange: [-18, 18], outputRange: ['-18deg', '18deg'], extrapolate: 'clamp' });

  // Shadow shrinks + fades as card rises
  const shadowOpacity = floatAnim.interpolate({ inputRange: [-14, 0], outputRange: [0.10, 0.28], extrapolate: 'clamp' });
  const shadowScaleX  = floatAnim.interpolate({ inputRange: [-14, 0], outputRange: [0.80, 1.05], extrapolate: 'clamp' });

  return (
    <View style={{ alignItems: 'center', marginBottom: 28 }}>
      {/* Layer 1 (JS): perspective + tilt + scale â€” MUST be separate from native layer */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [
            { perspective: 900 },
            { rotateX },
            { rotateY },
            { scale: scaleAnim },
          ],
        }}
      >
        {/* Layer 2 (native): vertical float */}
        <Animated.View style={[fc.card, { transform: [{ translateY: floatAnim }] }]}>
          <View style={[fc.corner, fc.cornerTL]} />
          <View style={[fc.corner, fc.cornerTR]} />

          <View style={fc.avatar}>
            <Ionicons name="person" size={30} color="#D4AF37" />
          </View>

          <View style={fc.nameLine} />
          <View style={fc.roleLine} />
          <View style={fc.divider} />

          <View style={fc.infoRow}>
            <Ionicons name="call-outline" size={16} color="#D4AF37" />
            <View style={fc.infoBar} />
          </View>
          <View style={fc.infoRow}>
            <Ionicons name="mail-outline" size={16} color="#D4AF37" />
            <View style={[fc.infoBar, { width: '60%' }]} />
          </View>
          <View style={fc.infoRow}>
            <Ionicons name="location-outline" size={16} color="#D4AF37" />
            <View style={[fc.infoBar, { width: '45%' }]} />
          </View>

          <View style={[fc.corner, fc.cornerBL]} />
          <View style={[fc.corner, fc.cornerBR]} />
        </Animated.View>
      </Animated.View>

      {/* Soft shadow ellipse â€” synced to float height */}
      <Animated.View
        style={[fc.shadowEllipse, {
          opacity: shadowOpacity,
          transform: [{ scaleX: shadowScaleX }],
        }]}
      />
    </View>
  );
});

const fc = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: '#0B0E1E',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    shadowColor: '#C9A227',
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 14,
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    opacity: 0.9,
  },
  cornerTL: { top: 12, left: 12 },
  cornerTR: { top: 12, right: 12 },
  cornerBL: { bottom: 12, left: 12 },
  cornerBR: { bottom: 12, right: 12 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1F35',
    borderWidth: 2.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nameLine: {
    width: CARD_W * 0.52,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4AF37',
    opacity: 0.9,
    marginBottom: 7,
  },
  roleLine: {
    width: CARD_W * 0.36,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.22,
    marginBottom: 12,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.25,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    width: '90%',
  },
  infoBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.18,
  },
  shadowEllipse: {
    width: CARD_W * 0.65,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#C9A227',
    marginTop: 2,
  },
});
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { landingStyles } from '../../styles/screens/landingStyles';
import COLORS from '../../styles/colors';
import { getDBCUsers } from '../../utils/contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import AnimatedPressable from '../../components/common/AnimatedPressable';
import websocketService from '../../utils/websocketService';
import Footer from '../../components/common/Footer';
// â”€â”€â”€ Moved OUTSIDE LandingScreen â€” was previously defined inside render,
//     causing it to remount on every parent state change.
const InboxButton = React.memo(({ navigation }) => {
  const [unreadCount, setUnreadCount] = useState(2);
  const isMounted = useRef(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  // Pulse the badge while there are unread messages
  useEffect(() => {
    if (unreadCount > 0) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.spring(pulseAnim, { toValue: 1.3, useNativeDriver: true, speed: 18, bounciness: 10 }),
          Animated.spring(pulseAnim, { toValue: 1,   useNativeDriver: true, speed: 18, bounciness: 6  }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 0 }).start();
    }
  }, [unreadCount, pulseAnim]);

  const handleInboxPress = useCallback(() => {
    navigation.navigate('InboxScreen');
    setTimeout(() => {
      if (isMounted.current) setUnreadCount(0);
    }, 500);
  }, [navigation]);

  return (
    <View style={ls.inboxWrap}>
      <AnimatedPressable
        style={landingStyles.secondaryButton}
        onPress={handleInboxPress}
      >
        <Ionicons name="mail-outline" size={20} color={COLORS.accent} />
        <Text style={landingStyles.secondaryButtonText}>Inbox</Text>
        {unreadCount > 0 && (
          <Animated.View style={[ls.badge, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={ls.badgeText}>{unreadCount}</Text>
          </Animated.View>
        )}
      </AnimatedPressable>
    </View>
  );
});

// â”€â”€â”€ Contact row â€” memoized so it only re-renders when its own data changes
const ContactRow = React.memo(({ contact, onPress }) => (
  <TouchableOpacity
    style={landingStyles.contactCard}
    onPress={onPress}
  >
    <View style={landingStyles.contactInfo}>
      <Text style={landingStyles.contactName}>{contact.name || 'Unknown'}</Text>
    </View>
    <View style={landingStyles.contactCategory}>
      <Text style={landingStyles.contactCategoryText}>
        {contact.designation || contact.companyName || 'Professional'}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </View>
  </TouchableOpacity>
));

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function LandingScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // â”€â”€ Back button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };
    const handler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => handler.remove();
  }, []);

  // â”€â”€ Data loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const loadContacts = useCallback(async () => {
    try {
      const users = await getDBCUsers();
      setContacts(users || []);
    } catch (e) {
      console.log('Error loading contacts:', e);
    }
  }, []);

  useEffect(() => {
    loadContacts();
    const unsubscribe = navigation.addListener('focus', loadContacts);
    return unsubscribe;
  }, [navigation, loadContacts]);

  useEffect(() => {
    AsyncStorage.getItem('loggedInUserId').then((userId) => {
      if (userId) {
        websocketService.connect(userId);
      }
    });
  }, []);

  // â”€â”€ Derived: filtered contacts (memoized â€” recalculates only when deps change)
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const q = searchQuery.toLowerCase();
    return contacts.filter(
      c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.designation && c.designation.toLowerCase().includes(q))
    );
  }, [contacts, searchQuery]);

  // â”€â”€ Handlers (useCallback â€” stable references, no recreation on re-render)
  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  const handleCreateCard = useCallback(() => {
    navigation.navigate('PersonalDetails');
  }, [navigation]);

  const requestMicrophonePermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone access',
          message: 'Allow access to the microphone so you can speak search queries.',
          buttonPositive: 'Allow',
          buttonNegative: 'Cancel',
        },
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log('Microphone permission error:', err);
      return false;
    }
  }, []);

  const handleMicPress = useCallback(async () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const granted = await requestMicrophonePermission();
    if (!granted) {
      Alert.alert(
        'Microphone access needed',
        'Enable microphone access from your device settings to use voice search.',
      );
      return;
    }

    setIsListening(true);
  }, [isListening, requestMicrophonePermission]);

  const handleLogout = useCallback(async () => {
    await websocketService.disconnect();
    try {
      await apiFetch('/user/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.log('Logout API error:', e);
    }
    await AsyncStorage.removeItem('userPhone');
    setMenuVisible(false);
    navigation.replace('Login');
  }, [navigation]);

  useEffect(() => {
    if (!isListening) return;
    const timer = setTimeout(() => setIsListening(false), 4200);
    return () => clearTimeout(timer);
  }, [isListening]);

  // â”€â”€ FlatList render functions (useCallback â€” stable reference for FlatList)
  const renderContact = useCallback(({ item }) => (
    <ContactRow
      contact={item}
      onPress={() => navigation.navigate('SelectTemplate', { contact: item })}
    />
  ), [navigation]);

  const keyExtractContact  = useCallback((_, i) => String(i), []);

  // â”€â”€ UI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>

      {/* TOP BAR */}
      <View style={ls.topBar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={ls.menuBtn}>
          <Ionicons name="menu" size={28} color={COLORS.accent} />
        </TouchableOpacity>

        <View style={ls.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={ls.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            onPress={handleMicPress}
            accessibilityLabel="Toggle voice search"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name={isListening ? 'mic-circle' : 'mic'}
              size={20}
              color={isListening ? '#4ECCA3' : COLORS.accent}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={ls.profileIconBtn}
          onPress={() => navigation.push('Profile', { fromScreen: 'Landing' })}
        >
          <Ionicons name="person-circle" size={32} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {isListening && (
        <View style={ls.micStatus}>
          <View style={ls.micPulse} />
          <Text style={ls.micStatusText}>Listening for voice search...</Text>
        </View>
      )}

      {/* SIDE MENU */}
      <Modal visible={menuVisible} animationType="slide" transparent>
        <TouchableOpacity
          style={ls.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={ls.sideMenu}>
            <Text style={ls.menuTitle}>Menu</Text>

            <TouchableOpacity
              style={ls.menuItem}
              onPress={() => { setMenuVisible(false); setShowComingSoon(true); }}
              activeOpacity={0.85}
            >
              <Ionicons name="settings-outline" size={22} color={COLORS.accent} style={ls.menuIcon} />
              <Text style={ls.menuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={ls.menuItem} onPress={handleLogout} activeOpacity={0.85}>
              <Ionicons name="log-out-outline" size={22} color="red" style={ls.menuIcon} />
              <Text style={[ls.menuItemText, { color: 'red' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* COMING SOON MODAL */}
      <Modal visible={showComingSoon} transparent animationType="fade">
        <View style={ls.centeredOverlay}>
          <View style={ls.comingSoonBox}>
            <Ionicons name="construct-outline" size={40} color="#D4AF37" />
            <Text style={ls.comingSoonTitle}>Feature Coming Soon</Text>
            <Text style={ls.comingSoonSub}>This feature will be available in the next update.</Text>
            <TouchableOpacity
              onPress={() => setShowComingSoon(false)}
              style={ls.comingSoonBtn}
            >
              <Text style={ls.comingSoonBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CONTACTS LIST */}
      {filteredContacts.length > 0 ? (
        <FlatList
          data={filteredContacts}
          keyExtractor={keyExtractContact}
          renderItem={renderContact}
          contentContainerStyle={landingStyles.contactsListContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={landingStyles.contactsListContainer}>
            <View style={landingStyles.emptyContainer}>
              <FloatingCard />
              {/* <Text style={landingStyles.emptyTitle}>No Contacts Yet</Text> */}
              <Text style={landingStyles.emptySubtitle}>
                Create your digital business card and start sharing with the world
              </Text>

              <AnimatedPressable style={landingStyles.createButton} onPress={handleCreateCard}>
                <Ionicons name="add-circle" size={20} color="#FFF" />
                <Text style={landingStyles.createButtonText}>Create Your Card</Text>
              </AnimatedPressable>

              <AnimatedPressable
                style={landingStyles.secondaryButton}
                onPress={() => navigation.navigate('MyCards')}
              >
                <Ionicons name="albums-outline" size={20} color={COLORS.accent} />
                <Text style={landingStyles.secondaryButtonText}>My Cards</Text>
              </AnimatedPressable>

              <InboxButton navigation={navigation} />
            </View>
          </View>
        </ScrollView>
      )}

      <Footer activeTab="home" navigation={navigation} fromScreen="Landing" />
    </SafeAreaView>
  );
}

// â”€â”€â”€ Styles for newly added/extracted elements (landing-screen specific)
const ls = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  menuBtn: { padding: 6 },
  searchBox: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  profileIconBtn: {
    padding: 4,
  },
  searchInput: { flex: 1, marginLeft: 6, fontSize: 14, color: COLORS.text },
  micStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 4,
  },
  micPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ECCA3',
  },
  micStatusText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#4ECCA3',
    fontWeight: '600',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sideMenu: {
    width: 270,
    height: '100%',
    backgroundColor: COLORS.surface,
    paddingTop: 48,
    paddingHorizontal: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 4, height: 0 },
  },
  menuTitle: { fontSize: 22, fontWeight: '800', marginBottom: 28, color: COLORS.accent },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: COLORS.surfaceAlt,
  },
  menuIcon: { marginRight: 14 },
  menuItemText: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  centeredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonBox: {
    width: '82%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    elevation: 8,
  },
  comingSoonTitle: { fontSize: 18, fontWeight: '700', marginTop: 14, color: COLORS.text },
  comingSoonSub: { textAlign: 'center', marginTop: 8, color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
  comingSoonBtn: {
    marginTop: 20,
    backgroundColor: COLORS.accent,
    paddingVertical: 11,
    paddingHorizontal: 36,
    borderRadius: 12,
  },
  comingSoonBtnText: { color: COLORS.surface, fontWeight: '700', fontSize: 14 },
  inboxWrap: { width: '100%', alignItems: 'center', marginTop: 8 },
  inboxBtn: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: 8,
    right: 30,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  badgeText: { color: COLORS.surface, fontWeight: 'bold', fontSize: 11 },
});

