/**
 * SharedCardPreviewScreen
 *
 * Shown to a non-DBC user who opens a share link.
 * Route params: { cardId, receiverMobile, senderName }
 *
 * - Fetches the card via GET /api/card/public/{cardId}  (no auth needed)
 * - Renders the business card template
 * - Shows a "Sign Up" button that pre-fills the receiver's mobile in SignupScreen
 * - NO "Save Card" button — the user must sign up first
 */
import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Linking,
} from 'react-native';
import { Buffer } from 'buffer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getPublicCard } from '../../utils/api';
import ClassicTemplate from '../../components/templates/ClassicTemplate';
import ModernTemplate from '../../components/templates/ModernTemplate';
import DarkTemplate from '../../components/templates/DarkTemplate';

const GOLD = '#C9A227';
const TEMPLATES = { classic: ClassicTemplate, modern: ModernTemplate, dark: DarkTemplate };

const decodeId = (encoded) => {
  try {
    return Buffer.from(String(encoded), 'base64').toString('utf8');
  } catch {
    return '';
  }
};

const resolveCardId = (incomingCardId) => {
  const raw = String(incomingCardId || '').trim();
  if (!raw) return null;
  if (/^\d+$/.test(raw)) return Number(raw);

  const decoded = decodeId(raw).trim();
  if (/^\d+$/.test(decoded)) return Number(decoded);
  return null;
};

export default function SharedCardPreviewScreen({ navigation, route }) {
  const { cardId, receiverMobile, senderName: routeSenderName } = route?.params || {};
  const resolvedCardId = resolveCardId(cardId);

  const [card, setCard]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!resolvedCardId) { setError('Invalid link - card ID is missing.'); setLoading(false); return; }
    (async () => {
      try {
        const { res, data } = await getPublicCard(resolvedCardId);
        if (res.ok && data?.cardId) {
          // Normalize field names so templates render correctly
          setCard({
            ...data,
            phone: data.phone || data.phoneNumber || data.phoneNumber1 || '',
            phone2: data.phone2 || data.phoneNumber2 || '',
            whatsapp: data.whatsapp || data.whatsappUrl || '',
            businessSubCategory: data.businessSubCategory || data.businessSubcategory || '',
            businessDescription: data.businessDescription || data.description || '',
            profileImage: data.profileImage || data.photo || data.profileImageFileId || null,
            companyLogo: data.companyLogo || data.logo || data.logoFileId || null,
            qrCodeImage: data.qrCodeImage || data.qrImage || data.qrFileId1 || null,
            qrCodeImage2: data.qrCodeImage2 || data.qrImage2 || data.qrFileId2 || null,
            descriptionPdf: data.descriptionPdf || data.businessPdf || data.pdfFileId || null,
            clients: data.clients || data.clientList || '',
            template: data.template || data.templateSlug || 'classic',
          });
        } else {
          setError('This card is no longer available.');
        }
      } catch {
        setError('Could not load the card. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [resolvedCardId]);

  const senderDisplay = card?.senderName || routeSenderName || 'Someone';
  const TemplateComp = TEMPLATES[card?.template] || ClassicTemplate;

  const handleSignUp = () => {
    navigation.navigate('Signup', { prefillMobile: receiverMobile ? String(receiverMobile) : '' });
  };

  const handleLogin = () => {
    navigation.navigate('Login', { prefillMobile: receiverMobile ? String(receiverMobile) : '' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={GOLD} />
        <Text style={styles.loadingText}>Loading your card…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.btnGold} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnGoldText}>Go to App</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.appBadge}>
          <Text style={styles.appBadgeText}>ShareCards</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Sender banner */}
        <View style={styles.senderBanner}>
          <View style={styles.senderAvatarWrap}>
            <Text style={styles.senderAvatarLetter}>
              {senderDisplay.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.senderTitle}>
              <Text style={styles.senderName}>{senderDisplay}</Text> shared a business card with you
            </Text>
            <Text style={styles.senderSub}>Sign up to save this card and get your own</Text>
          </View>
        </View>

        {/* The card */}
        <View style={styles.cardWrap}>
          <TemplateComp userData={card} />
        </View>

        {/* Sign Up CTA */}
        <View style={styles.ctaBox}>
          <View style={styles.ctaIconRow}>
            <Ionicons name="lock-closed-outline" size={18} color={GOLD} />
            <Text style={styles.ctaTitle}>Create a free account to access this card</Text>
          </View>
          <Text style={styles.ctaSub}>
            Sign up with your mobile number{receiverMobile ? ` (${receiverMobile})` : ''} to view,
            save and share digital business cards.
          </Text>

          <TouchableOpacity style={styles.btnGold} onPress={handleSignUp} activeOpacity={0.85}>
            <Ionicons name="person-add-outline" size={18} color="#fff" />
            <Text style={styles.btnGoldText}>  Sign Up — It's Free</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginRowText}>Already have an account?  </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Log In →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.howBox}>
          <Text style={styles.howTitle}>How it works</Text>
          <View style={styles.howStep}>
            <View style={styles.howNum}><Text style={styles.howNumText}>1</Text></View>
            <Text style={styles.howStepText}>Tap <Text style={styles.bold}>Sign Up</Text> and enter your mobile number</Text>
          </View>
          <View style={styles.howStep}>
            <View style={styles.howNum}><Text style={styles.howNumText}>2</Text></View>
            <Text style={styles.howStepText}>Verify with the OTP sent to your phone</Text>
          </View>
          <View style={styles.howStep}>
            <View style={styles.howNum}><Text style={styles.howNumText}>3</Text></View>
            <Text style={styles.howStepText}>This card — and any others shared with you — will appear in your <Text style={styles.bold}>Inbox</Text> automatically</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#f5f5f5' },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#fff' },
  scroll:      { padding: 16, paddingBottom: 48 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#888' },
  errorText:   { marginTop: 12, fontSize: 14, color: '#ef4444', textAlign: 'center', lineHeight: 22 },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#1a1a1a', borderBottomWidth: 0,
  },
  appBadge: {
    backgroundColor: GOLD, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  appBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },

  senderBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginBottom: 16,
    borderWidth: 1.5, borderColor: '#E6D7A3',
  },
  senderAvatarWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1a1a1a',
    alignItems: 'center', justifyContent: 'center',
  },
  senderAvatarLetter: { color: GOLD, fontWeight: '800', fontSize: 18 },
  senderTitle: { fontSize: 13, color: '#333', lineHeight: 19 },
  senderName:  { fontWeight: '700', color: '#1a1a1a' },
  senderSub:   { fontSize: 11, color: '#888', marginTop: 3 },

  cardWrap: {
    borderRadius: 16, overflow: 'hidden', marginBottom: 20,
    elevation: 6, shadowColor: '#000',
    shadowOpacity: 0.14, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },

  ctaBox: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    marginBottom: 16, borderWidth: 1.5, borderColor: '#E6D7A3',
  },
  ctaIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  ctaTitle:   { fontWeight: '700', fontSize: 14, color: '#1a1a1a', flex: 1 },
  ctaSub:     { fontSize: 12, color: '#666', lineHeight: 19, marginBottom: 16 },

  btnGold: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: GOLD, borderRadius: 12,
    paddingVertical: 14, marginBottom: 12,
    elevation: 3, shadowColor: GOLD, shadowOpacity: 0.3,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  btnGoldText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  loginRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  loginRowText: { fontSize: 13, color: '#888' },
  loginLink:    { fontSize: 13, color: GOLD, fontWeight: '700' },

  howBox: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#eee',
  },
  howTitle: { fontWeight: '700', fontSize: 13, color: '#1a1a1a', marginBottom: 14 },
  howStep: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12,
  },
  howNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  howNumText:   { fontSize: 11, fontWeight: '800', color: GOLD },
  howStepText:  { flex: 1, fontSize: 13, color: '#444', lineHeight: 20 },
  bold:         { fontWeight: '700', color: '#1a1a1a' },
});

