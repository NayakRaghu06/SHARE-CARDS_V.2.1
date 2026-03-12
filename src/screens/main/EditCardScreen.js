import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch } from '../../utils/api';
import AppHeader from '../../components/common/AppHeader';
import FS from '../../styles/typography';

export default function EditCardScreen({ route, navigation }) {
  const { cardData } = route.params;
  const cardId = cardData.cardId;

  const [name, setName] = useState(cardData.name || '');
  const [companyName, setCompanyName] = useState(cardData.companyName || '');
  const [designation, setDesignation] = useState(cardData.designation || '');
  const phone = cardData.phoneNumber || cardData.phone || cardData.mobileNumber || '';
  const [email, setEmail] = useState(cardData.email || '');
  const [address, setAddress] = useState(cardData.address || '');
  const [searchKeywords, setSearchKeywords] = useState(cardData.keywords || cardData.searchKeywords || '');
  const [businessCategory, setBusinessCategory] = useState(cardData.businessCategory || '');
  const [businessSubCategory, setBusinessSubCategory] = useState(cardData.businessSubcategory || cardData.businessSubCategory || '');
  const [clients, setClients] = useState(cardData.clients || '');
  const [description, setDescription] = useState(cardData.businessDescription || cardData.description || '');
  const [whatsapp, setWhatsapp] = useState(cardData.whatsappUrl || cardData.whatsapp || '');
  const [linkedin, setLinkedin] = useState(cardData.linkedin || '');
  const [instagram, setInstagram] = useState(cardData.instagram || '');
  const [twitter, setTwitter] = useState(cardData.twitter || '');
  const [facebook, setFacebook] = useState(cardData.facebook || '');
  const [website, setWebsite] = useState(cardData.website || '');
  const [focusedField, setFocusedField] = useState(null);
  const btnScale = useRef(new Animated.Value(1)).current;

  const handleUpdate = async () => {
    try {
      // PUT /api/cards/update-card/{cardId}
      const payload = {
        name,
        designation,
        companyName,
        phoneNumber: phone,
        email: email || null,
        address: address || null,
        keywords: searchKeywords || null,
        businessCategory: businessCategory || null,
        businessSubcategory: businessSubCategory || null,
        clients: clients || null,
        businessDescription: description || null,
        whatsappUrl: whatsapp || null,
        linkedin: linkedin || null,
        facebook: facebook || null,
        instagram: instagram || null,
        twitter: twitter || null,
        templateSlug: cardData.templateSlug || 'classic',
      };
      const { res, data } = await apiFetch(`/api/cards/update-card/${cardId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.status === 401) { navigation.replace('Login'); return; }
      if (res.ok) {
        navigation.goBack();
      } else {
        Alert.alert('Error', data?.message || 'Failed to update card');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update card');
    }
  };

  const firstLetter = name && name.length > 0 ? name.trim().charAt(0).toUpperCase() : 'N';

  const animatePressIn = () =>
    Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, speed: 25, bounciness: 0 }).start();
  const animatePressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 5 }).start();

  const F = focusedField;

  const Icon = ({ name, multiline }) => (
    <View style={[styles.iconWrapper, multiline && { alignSelf: 'flex-start', marginTop: 2 }]}>
      <Ionicons name={name} size={17} color="#D4AF37" />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>{firstLetter}</Text>
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

            <View style={[styles.inputRow, F === 'keywords' && styles.inputRowFocused]}>
              <Icon name="search" />
              <TextInput style={styles.inputText} value={searchKeywords} onChangeText={setSearchKeywords} placeholder="Search Keywords" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('keywords')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'category' && styles.inputRowFocused]}>
              <Icon name="pricetag" />
              <TextInput style={styles.inputText} value={businessCategory} onChangeText={setBusinessCategory} placeholder="Business Category" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('category')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'subcat' && styles.inputRowFocused]}>
              <Icon name="layers" />
              <TextInput style={styles.inputText} value={businessSubCategory} onChangeText={setBusinessSubCategory} placeholder="Business Sub-Category" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('subcat')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, F === 'clients' && styles.inputRowFocused]}>
              <Icon name="people" />
              <TextInput style={styles.inputText} value={clients} onChangeText={setClients} placeholder="Clients" placeholderTextColor="#9CA3AF" onFocus={() => setFocusedField('clients')} onBlur={() => setFocusedField(null)} />
            </View>

            <View style={[styles.inputRow, styles.inputRowMultiline, F === 'description' && styles.inputRowFocused]}>
              <Icon name="document-text" multiline />
              <TextInput style={[styles.inputText, { minHeight: 60 }]} value={description} onChangeText={setDescription} placeholder="Description" placeholderTextColor="#9CA3AF" multiline onFocus={() => setFocusedField('description')} onBlur={() => setFocusedField(null)} />
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
        </ScrollView>

        {/* Sticky Update Button */}
        <View style={styles.stickyButtonContainer}>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.updateBtn}
              onPress={handleUpdate}
              onPressIn={animatePressIn}
              onPressOut={animatePressOut}
              activeOpacity={1}
            >
              <Text style={styles.updateBtnText}>Update Card</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0F172A',
    borderWidth: 3,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatarLetter: {
    color: '#D4AF37',
    fontSize: FS.display,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 110,
    paddingHorizontal: 14,
    paddingTop: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: FS.h4,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionUnderline: {
    height: 3,
    width: 42,
    backgroundColor: '#D4AF37',
    borderRadius: 2,
    marginTop: 6,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputRowFocused: {
    borderColor: '#D4AF37',
    backgroundColor: '#FFFFFF',
  },
  inputRowDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E5E7EB',
    opacity: 0.7,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
  },
  iconWrapper: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    flex: 1,
    fontSize: FS.lg,
    color: '#111827',
    padding: 0,
  },
  inputTextDisabled: {
    color: '#94A3B8',
  },
  stickyButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  updateBtn: {
    backgroundColor: '#D4AF37',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  updateBtnText: {
    color: '#0F172A',
    fontSize: FS.xl,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
