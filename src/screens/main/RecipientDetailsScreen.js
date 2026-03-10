import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Linking,
  Share,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { generateShareLink } from '../../utils/api';
import AppHeader from '../../components/common/AppHeader';

const GOLD = '#C9A227';
const GOLD_LIGHT = '#E6D7A3';
const GOLD_BG = '#FDF6E3';
const ERROR = '#EF4444';
const ERROR_BG = '#FFF5F5';
const ERROR_BORDER = '#FECACA';

export default function RecipientDetailsScreen({ navigation, route }) {
  const { cardId, prefillMobile } = route?.params || {};

  const [recipientName, setRecipientName] = useState('');
  const [mobile, setMobile] = useState(prefillMobile || '');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Inline validation errors
  const [errors, setErrors] = useState({ name: '', mobile: '' });

  // Share link modal state
  const [shareLink, setShareLink] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareMessage = shareLink
    ? `Hi ${recipientName},\nYou have received a Digital Business Card.\nView here: ${shareLink}\nPlease login with your mobile number to access the card.`
    : '';

  const validate = () => {
    const newErrors = { name: '', mobile: '' };
    let valid = true;

    if (!recipientName.trim()) {
      newErrors.name = 'Please enter recipient name';
      valid = false;
    }
    if (!mobile || mobile.length !== 10) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleShareCard = async () => {
    if (!validate()) return;

    if (!cardId) {
      Alert.alert('Error', 'Card ID is missing. Please go back and try again.');
      return;
    }

    setLoading(true);
    try {
      const { res, data } = await generateShareLink(
        cardId,
        recipientName.trim(),
        mobile,
        email.trim() || undefined
      );

      if (res.status === 401) {
        navigation.replace('Login');
        return;
      }

      if (res.ok && (data?.shareLink || data?.link || data?.url)) {
        const rawLink = data.shareLink || data.link || data.url;
        setShareLink(rawLink);
        setSmsBody(data?.smsBody || '');
        setWhatsappUrl(data?.whatsappUrl || '');
        setEmailSubject(data?.emailSubject || 'Digital Business Card Shared With You');
        setEmailBody(data?.emailBody || '');
        setModalVisible(true);
      } else {
        const msg = data?.message || data?.error || `Server error ${res.status}`;
        Alert.alert('Error', msg);
      }
    } catch (e) {
      console.warn('[RecipientDetails] generateShareLink error:', e);
      Alert.alert('Error', 'Failed to generate share link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await Share.share({ message: shareLink });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled share sheet — no error needed
    }
  };

  const handleShareWhatsApp = async () => {
    const url = whatsappUrl || `https://wa.me/91${mobile}?text=${encodeURIComponent(shareMessage)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('WhatsApp not found', 'Could not open WhatsApp.');
    }
  };

  const handleShareSMS = async () => {
    const body = smsBody || shareMessage;
    const url = `sms:${mobile}${mobile ? `?body=${encodeURIComponent(body)}` : ''}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Error', 'Could not open SMS app.');
    }
  };

  const handleShareEmail = async () => {
    const subject = encodeURIComponent(emailSubject || 'Digital Business Card Shared With You');
    const body = encodeURIComponent(emailBody || shareMessage);
    const to = email ? email.trim() : '';
    const url = `mailto:${to}?subject=${subject}&body=${body}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Error', 'Could not open email app.');
    }
  };

  const handleSystemShare = async () => {
    try {
      await Share.share({ message: smsBody || shareMessage });
    } catch {
      Alert.alert('Error', 'Could not open share sheet.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerBlock}>
          <View style={styles.headerIcon}>
            <Ionicons name="person-add-outline" size={26} color={GOLD} />
          </View>
          <Text style={styles.title}>Enter Recipient Details</Text>
          <Text style={styles.subtitle}>
            Share your business card with someone who isn't on ShareCards yet.
          </Text>
        </View>

        {/* Recipient Name */}
        <Text style={styles.label}>
          Recipient Name <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.inputWrapper, errors.name ? styles.inputWrapperError : null]}>
          <Ionicons
            name="person-outline"
            size={18}
            color={errors.name ? ERROR : GOLD}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#aaa"
            value={recipientName}
            onChangeText={(t) => {
              setRecipientName(t);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>
        {errors.name ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={13} color={ERROR} />
            <Text style={styles.errorText}>{errors.name}</Text>
          </View>
        ) : null}

        {/* Mobile Number */}
        <Text style={[styles.label, errors.name ? styles.labelWithError : null]}>
          Mobile Number <Text style={styles.required}>*</Text>
        </Text>
        <View style={[styles.inputWrapper, errors.mobile ? styles.inputWrapperError : null]}>
          <View style={[styles.countryBox, errors.mobile ? styles.countryBoxError : null]}>
            <Text style={styles.countryText}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="10 digit mobile number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            onChangeText={(t) => {
              setMobile(t);
              if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }));
            }}
            returnKeyType="next"
          />
        </View>
        {errors.mobile ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={13} color={ERROR} />
            <Text style={styles.errorText}>{errors.mobile}</Text>
          </View>
        ) : null}

        {/* Email Address */}
        <Text style={[styles.label, errors.mobile ? styles.labelWithError : null]}>
          Email Address <Text style={styles.optional}>(optional)</Text>
        </Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color={GOLD} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            returnKeyType="done"
          />
        </View>

        {/* Share Card Button */}
        <TouchableOpacity
          style={[styles.shareBtn, loading && styles.shareBtnDisabled]}
          onPress={handleShareCard}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="link-outline" size={20} color="#fff" />
              <Text style={styles.shareBtnText}>  Generate Share Link</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ── Share Link Modal ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            {/* Drag handle */}
            <View style={styles.dragHandle} />

            <Text style={styles.modalTitle}>Share Card Link</Text>
            <Text style={styles.modalSubtitle}>
              Send this link to <Text style={styles.bold}>{recipientName}</Text> so they can view your card.
            </Text>

            {/* Link box */}
            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={2} selectable>
                {shareLink}
              </Text>
              <TouchableOpacity
                style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
                onPress={handleCopyLink}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={copied ? 'checkmark-outline' : 'copy-outline'}
                  size={18}
                  color={copied ? '#fff' : GOLD}
                />
                <Text style={[styles.copyBtnText, copied && styles.copyBtnTextSuccess]}>
                  {copied ? 'Shared!' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Share options */}
            <Text style={styles.shareOptionsLabel}>Share via</Text>

            <View style={styles.shareOptionsGrid}>
              <TouchableOpacity style={styles.shareOption} onPress={handleShareWhatsApp} activeOpacity={0.8}>
                <View style={[styles.shareOptionIcon, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="logo-whatsapp" size={24} color="#fff" />
                </View>
                <Text style={styles.shareOptionLabel}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareOption} onPress={handleShareSMS} activeOpacity={0.8}>
                <View style={[styles.shareOptionIcon, { backgroundColor: '#3B82F6' }]}>
                  <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.shareOptionLabel}>SMS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareOption} onPress={handleShareEmail} activeOpacity={0.8}>
                <View style={[styles.shareOptionIcon, { backgroundColor: '#EF4444' }]}>
                  <Ionicons name="mail-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.shareOptionLabel}>Email</Text>
              </TouchableOpacity>

            </View>

            {/* Message preview */}
            <View style={styles.previewBox}>
              <Text style={styles.previewLabel}>Message Preview</Text>
              <Text style={styles.previewText}>{shareMessage}</Text>
            </View>

            {/* Sign Up notice for non-DBC receiver */}
            <View style={{ backgroundColor: 'rgba(201,162,39,0.08)', borderRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#C9A227', marginBottom: 4 }}>📲 How the receiver accesses the card</Text>
              <Text style={{ fontSize: 11, color: '#555', lineHeight: 17 }}>
                When they open the link → tap <Text style={{ fontWeight: '700' }}>Sign Up</Text> → verify their number → card appears in their Inbox automatically.
              </Text>
            </View>

            {/* Close */}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)} activeOpacity={0.85}>
              <Text style={styles.closeBtnText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },

  // Header block
  headerBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: GOLD_BG,
    borderWidth: 1.5,
    borderColor: GOLD_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },

  // Labels
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginTop: 4,
  },
  labelWithError: {
    marginTop: 14,
  },
  required: {
    color: ERROR,
  },
  optional: {
    color: '#999',
    fontWeight: '400',
  },

  // Inputs
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: GOLD_LIGHT,
    overflow: 'hidden',
  },
  inputWrapperError: {
    borderColor: ERROR,
    backgroundColor: ERROR_BG,
  },
  inputIcon: {
    paddingHorizontal: 14,
  },
  countryBox: {
    backgroundColor: GOLD_BG,
    paddingHorizontal: 14,
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: GOLD_LIGHT,
  },
  countryBoxError: {
    backgroundColor: ERROR_BG,
    borderRightColor: ERROR_BORDER,
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
    fontSize: 15,
    color: '#111',
  },

  // Inline error
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  errorText: {
    fontSize: 12,
    color: ERROR,
    fontWeight: '500',
    flex: 1,
  },

  // Share button
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    height: 52,
    borderRadius: 12,
    marginTop: 20,
    elevation: 3,
    shadowColor: GOLD,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  shareBtnDisabled: {
    backgroundColor: '#D4C07A',
    elevation: 0,
    shadowOpacity: 0,
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingBottom: 36,
    paddingTop: 12,
    maxHeight: '92%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#1A1A1A',
  },

  // Link box
  linkBox: {
    backgroundColor: GOLD_BG,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: GOLD_LIGHT,
    padding: 14,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: '#1A1A1A',
    lineHeight: 18,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: GOLD_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 4,
  },
  copyBtnSuccess: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: GOLD,
  },
  copyBtnTextSuccess: {
    color: '#fff',
  },

  // Share options grid
  shareOptionsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  shareOptionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 22,
  },
  shareOption: {
    alignItems: 'center',
    gap: 8,
  },
  shareOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  shareOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },

  // Message preview
  previewBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },

  // Close
  closeBtn: {
    backgroundColor: '#1A1A1A',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
