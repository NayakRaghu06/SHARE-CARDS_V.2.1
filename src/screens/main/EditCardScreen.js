import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import AppHeader from '../../components/common/AppHeader';
import FS from '../../styles/typography';

export default function EditCardScreen({ route, navigation }) {
  const { cardData } = route.params;
  const cardId = cardData.cardId;

  // Personal
  const [name, setName]               = useState(cardData.name || '');
  const [companyName, setCompanyName] = useState(cardData.companyName || '');
  const [designation, setDesignation] = useState(cardData.designation || '');
  const phone = cardData.phoneNumber || cardData.phone || cardData.mobileNumber || '';
  const [email, setEmail]     = useState(cardData.email || '');
  const [address, setAddress] = useState(cardData.address || cardData.companyAddress || cardData.location || '');

  // Business
  const [businessCategory,    setBusinessCategory]    = useState(cardData.businessCategory || '');
  const [businessSubCategory, setBusinessSubCategory] = useState(cardData.businessSubcategory || cardData.businessSubCategory || '');
  const [description,         setDescription]         = useState(cardData.businessDescription || cardData.description || '');

  // Social
  const [whatsapp,  setWhatsapp]  = useState(cardData.whatsappUrl || cardData.whatsapp || '');
  const [linkedin,  setLinkedin]  = useState(cardData.linkedin || '');
  const [instagram, setInstagram] = useState(cardData.instagram || '');
  const [twitter,   setTwitter]   = useState(cardData.twitter || '');
  const [facebook,  setFacebook]  = useState(cardData.facebook || '');
  const [website,   setWebsite]   = useState(cardData.website || '');

  // Media
  const [profileImage, setProfileImage] = useState(cardData.profileImage || null);
  const [companyLogo,  setCompanyLogo]  = useState(cardData.companyLogo || null);

  const [focusedField, setFocusedField] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const btnScale = useRef(new Animated.Value(1)).current;

  // ── Image pickers ─────────────────────────────────────────────────────────
  const pickImage = async (setter) => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Required', 'Please allow gallery access to upload an image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) setter(result.assets[0].uri);
    } catch {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        name,
        designation,
        companyName,
        phoneNumber1:         phone,
        email:                email || null,
        companyAddress:       address || null,
        businessCategory:     businessCategory || null,
        businessSubcategory:  businessSubCategory || null,
        businessDescription:  description || null,
        whatsappUrl:          whatsapp || null,
        linkedin:             linkedin || null,
        facebook:             facebook || null,
        instagram:            instagram || null,
        twitterXLink:         twitter || null,
        website:              website || null,
        profileImage:         profileImage || null,
        companyLogo:          companyLogo || null,
        templateSlug:         cardData.templateSlug || 'classic',
      };
      const { res, data } = await apiFetch(`/api/cards/update-card/${cardId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.status === 401) { navigation.replace('Login'); return; }
      if (res.ok) {
        const updatedCard = {
          cardId,
          name,
          designation,
          companyName,
          phone,
          email:               email || null,
          address:             address || null,
          companyAddress:      address || null,  // server returns address as companyAddress
          businessCategory:    businessCategory || null,
          businessSubcategory: businessSubCategory || null,
          businessDescription: description || null,
          whatsappUrl:         whatsapp || null,
          linkedin:            linkedin || null,
          facebook:            facebook || null,
          instagram:           instagram || null,
          twitter:             twitter || null,
          website:             website || null,
        };
        // Persist locally so MyCardsScreen can merge it over every loadCards()
        // call until the server starts returning the updated data.
        await AsyncStorage.setItem(
          `pendingCardUpdate_${cardId}`,
          JSON.stringify(updatedCard),
        );
        navigation.navigate('MyCards', { _updatedCard: updatedCard });
      } else {
        Alert.alert('Error', data?.message || 'Failed to update card');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update card');
    } finally {
      setSubmitting(false);
    }
  };

  const firstLetter = name?.trim().charAt(0).toUpperCase() || 'N';

  const animatePressIn  = () => Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, speed: 25, bounciness: 0 }).start();
  const animatePressOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, speed: 24, bounciness: 5 }).start();

  const F = focusedField;

  const Icon = ({ name: iName, multiline }) => (
    <View style={[styles.iconWrapper, multiline && { alignSelf: 'flex-start', marginTop: 2 }]}>
      <Ionicons name={iName} size={17} color="#D4AF37" />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarLetter}>{firstLetter}</Text>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Personal Details ── */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Details</Text>
              <View style={styles.sectionUnderline} />
            </View>

            <View style={[styles.inputRow, F === 'name' && styles.inputRowFocused]}>
              <Icon name="person" />
              <TextInput style={styles.inputText} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'company' && styles.inputRowFocused]}>
              <Icon name="business" />
              <TextInput style={styles.inputText} value={companyName} onChangeText={setCompanyName} placeholder="Company Name" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('company')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'designation' && styles.inputRowFocused]}>
              <Icon name="briefcase" />
              <TextInput style={styles.inputText} value={designation} onChangeText={setDesignation} placeholder="Designation" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('designation')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, styles.inputRowDisabled]}>
              <Icon name="call" />
              <TextInput style={[styles.inputText, styles.inputTextDisabled]} value={phone} editable={false} placeholder="Phone" placeholderTextColor="#CBD5E1" keyboardType="phone-pad" />
            </View>

            <View style={[styles.inputRow, F === 'email' && styles.inputRowFocused]}>
              <Icon name="mail" />
              <TextInput style={styles.inputText} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#9CA3AF" keyboardType="email-address" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'address' && styles.inputRowFocused]}>
              <Icon name="location" />
              <TextInput style={styles.inputText} value={address} onChangeText={setAddress} placeholder="Address" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('address')} onBlur={() => setFocusedField(null)} />
            </View>
          </View>

          {/* ── Business Details ── */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Business Details</Text>
              <View style={styles.sectionUnderline} />
            </View>

            <View style={[styles.inputRow, F === 'bizcompany' && styles.inputRowFocused]}>
              <Icon name="business" />
              <TextInput style={styles.inputText} value={companyName} onChangeText={setCompanyName} placeholder="Company Name" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('bizcompany')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'category' && styles.inputRowFocused]}>
              <Icon name="pricetag" />
              <TextInput style={styles.inputText} value={businessCategory} onChangeText={setBusinessCategory} placeholder="Business Category" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('category')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'subcat' && styles.inputRowFocused]}>
              <Icon name="layers" />
              <TextInput style={styles.inputText} value={businessSubCategory} onChangeText={setBusinessSubCategory} placeholder="Business Sub-Category" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('subcat')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, styles.inputRowMultiline, F === 'description' && styles.inputRowFocused]}>
              <Icon name="document-text" multiline />
              <TextInput style={[styles.inputText, { minHeight: 60 }]} value={description} onChangeText={setDescription} placeholder="Business Description" placeholderTextColor="#9CA3AF" multiline onFocus={() => setFocusedField('description')} onBlur={() => setFocusedField(null)} />
            </View>
          </View>

          {/* ── Social Media ── */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Social Media</Text>
              <View style={styles.sectionUnderline} />
            </View>

            <View style={[styles.inputRow, F === 'whatsapp' && styles.inputRowFocused]}>
              <Icon name="logo-whatsapp" />
              <TextInput style={styles.inputText} value={whatsapp} onChangeText={setWhatsapp} placeholder="WhatsApp" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('whatsapp')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'linkedin' && styles.inputRowFocused]}>
              <Icon name="logo-linkedin" />
              <TextInput style={styles.inputText} value={linkedin} onChangeText={setLinkedin} placeholder="LinkedIn" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('linkedin')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'instagram' && styles.inputRowFocused]}>
              <Icon name="logo-instagram" />
              <TextInput style={styles.inputText} value={instagram} onChangeText={setInstagram} placeholder="Instagram" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('instagram')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'twitter' && styles.inputRowFocused]}>
              <Icon name="logo-twitter" />
              <TextInput style={styles.inputText} value={twitter} onChangeText={setTwitter} placeholder="Twitter" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('twitter')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'facebook' && styles.inputRowFocused]}>
              <Icon name="logo-facebook" />
              <TextInput style={styles.inputText} value={facebook} onChangeText={setFacebook} placeholder="Facebook" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('facebook')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'website' && styles.inputRowFocused]}>
              <Icon name="globe" />
              <TextInput style={styles.inputText} value={website} onChangeText={setWebsite} placeholder="Website" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('website')} onBlur={() => setFocusedField(null)} />
            </View>
          </View>

          {/* ── Media Uploads ── */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Media Uploads</Text>
              <View style={styles.sectionUnderline} />
            </View>

            {/* Profile Photo */}
            <Text style={styles.uploadLabel}>Profile Photo</Text>
            <TouchableOpacity style={styles.avatarUploadWrap} onPress={() => pickImage(setProfileImage)} activeOpacity={0.8}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profilePreview} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Ionicons name="person" size={36} color="#D4AF37" />
                </View>
              )}
              <View style={styles.cameraBtn}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
              <Text style={styles.uploadHint}>Tap to change photo</Text>
            </TouchableOpacity>

            {/* Company Logo */}
            <Text style={[styles.uploadLabel, { marginTop: 20 }]}>Company Logo</Text>
            <TouchableOpacity style={styles.logoUploadBox} onPress={() => pickImage(setCompanyLogo)} activeOpacity={0.8}>
              {companyLogo ? (
                <Image source={{ uri: companyLogo }} style={styles.logoPreview} />
              ) : (
                <>
                  <Ionicons name="image-outline" size={32} color="#D4AF37" />
                  <Text style={styles.logoUploadText}>Tap to upload logo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Sticky Update Button */}
        <View style={styles.stickyButtonContainer}>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[styles.updateBtn, submitting && { opacity: 0.7 }]}
              onPress={handleUpdate}
              onPressIn={animatePressIn}
              onPressOut={animatePressOut}
              activeOpacity={1}
              disabled={submitting}
            >
              {submitting
                ? <ActivityIndicator color="#0F172A" />
                : <Text style={styles.updateBtnText}>Update Card</Text>
              }
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },

  avatarContainer: { alignItems: 'center', marginTop: 16, marginBottom: 14 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#0F172A',
    borderWidth: 3, borderColor: '#D4AF37',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  avatarImage:  { width: 80, height: 80, borderRadius: 40 },
  avatarLetter: { color: '#D4AF37', fontSize: FS.display, fontWeight: '800' },

  scrollContent: { paddingBottom: 110, paddingHorizontal: 14, paddingTop: 4 },

  formCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24,
    paddingVertical: 22, paddingHorizontal: 18,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 4, marginBottom: 16,
  },
  sectionHeader: { marginBottom: 4 },
  sectionTitle:  { fontSize: FS.h4, fontWeight: '700', color: '#0F172A' },
  sectionUnderline: {
    height: 3, width: 42, backgroundColor: '#D4AF37',
    borderRadius: 2, marginTop: 6, marginBottom: 16,
  },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB',
  },
  inputRowFocused:  { borderColor: '#D4AF37', backgroundColor: '#FFFFFF' },
  inputRowDisabled: { backgroundColor: '#F1F5F9', borderColor: '#E5E7EB', opacity: 0.7 },
  inputRowMultiline:{ alignItems: 'flex-start' },
  iconWrapper: { marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  inputText:   { flex: 1, fontSize: FS.lg, color: '#111827', padding: 0 },
  inputTextDisabled: { color: '#94A3B8' },

  // ── Media uploads ──
  uploadLabel: { fontSize: FS.md, fontWeight: '600', color: '#0F172A', marginBottom: 10 },

  avatarUploadWrap: { alignItems: 'center', marginBottom: 4 },
  profilePlaceholder: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#FEF9EC',
    borderWidth: 2, borderColor: '#D4AF37',
    alignItems: 'center', justifyContent: 'center',
  },
  profilePreview: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: '#D4AF37' },
  cameraBtn: {
    position: 'absolute', bottom: 22, right: '32%',
    backgroundColor: '#D4AF37', borderRadius: 14,
    width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  uploadHint: { marginTop: 8, fontSize: FS.sm, color: '#94A3B8' },

  logoUploadBox: {
    borderWidth: 1.5, borderColor: '#D4AF37', borderStyle: 'dashed',
    borderRadius: 16, backgroundColor: '#FEFCE8',
    paddingVertical: 24, alignItems: 'center', justifyContent: 'center',
  },
  logoPreview:   { width: 120, height: 120, borderRadius: 12, resizeMode: 'contain' },
  logoUploadText:{ marginTop: 8, fontSize: FS.md, fontWeight: '600', color: '#D4AF37' },

  // ── Sticky button ──
  stickyButtonContainer: {
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  updateBtn: {
    backgroundColor: '#D4AF37', borderRadius: 16, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#D4AF37', shadowOpacity: 0.25, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  updateBtnText: { color: '#0F172A', fontSize: FS.xl, fontWeight: '700', letterSpacing: 0.5 },
});
