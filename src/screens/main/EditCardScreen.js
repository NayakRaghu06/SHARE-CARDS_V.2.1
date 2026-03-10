import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiFetch } from '../../utils/api';
import AppHeader from '../../components/common/AppHeader';

export default function EditCardScreen({ route, navigation }) {
  const { cardData } = route.params;
  const cardId = cardData.cardId;

  const [name, setName] = useState(cardData.name || '');
  const [companyName, setCompanyName] = useState(cardData.companyName || '');
  const [designation, setDesignation] = useState(cardData.designation || '');
  const phone = cardData.phoneNumber || cardData.phone || '';
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      {/* Avatar Preview */}
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
          <View style={styles.cardContainer}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput value={name} onChangeText={setName} style={styles.input} />
              <Text style={styles.label}>Company Name</Text>
              <TextInput value={companyName} onChangeText={setCompanyName} style={styles.input} />
              <Text style={styles.label}>Designation</Text>
              <TextInput value={designation} onChangeText={setDesignation} style={styles.input} />
              <Text style={styles.label}>Phone</Text>
              <TextInput
                value={phone}
                editable={false}
                style={[styles.input, styles.inputDisabled]}
                keyboardType="phone-pad"
              />
              <Text style={styles.label}>Email</Text>
              <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
              <Text style={styles.label}>Address</Text>
              <TextInput value={address} onChangeText={setAddress} style={styles.input} />
            </View>

            {/* Section Title */}
            <Text style={styles.sectionTitle}>Business Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Search Keywords</Text>
              <TextInput value={searchKeywords} onChangeText={setSearchKeywords} style={styles.input} />
              <Text style={styles.label}>Business Category</Text>
              <TextInput value={businessCategory} onChangeText={setBusinessCategory} style={styles.input} />
              <Text style={styles.label}>Business Sub-Category</Text>
              <TextInput value={businessSubCategory} onChangeText={setBusinessSubCategory} style={styles.input} />
              <Text style={styles.label}>Clients</Text>
              <TextInput value={clients} onChangeText={setClients} style={styles.input} />
              <Text style={styles.label}>Description</Text>
              <TextInput value={description} onChangeText={setDescription} style={[styles.input, { minHeight: 60 }]} multiline />
            </View>

            {/* Section Title */}
            <Text style={styles.sectionTitle}>Social Media</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>WhatsApp</Text>
              <TextInput value={whatsapp} onChangeText={setWhatsapp} style={styles.input} />
              <Text style={styles.label}>LinkedIn</Text>
              <TextInput value={linkedin} onChangeText={setLinkedin} style={styles.input} />
              <Text style={styles.label}>Instagram</Text>
              <TextInput value={instagram} onChangeText={setInstagram} style={styles.input} />
              <Text style={styles.label}>Twitter</Text>
              <TextInput value={twitter} onChangeText={setTwitter} style={styles.input} />
              <Text style={styles.label}>Facebook</Text>
              <TextInput value={facebook} onChangeText={setFacebook} style={styles.input} />
              <Text style={styles.label}>Website</Text>
              <TextInput value={website} onChangeText={setWebsite} style={styles.input} />
            </View>
          </View>
        </ScrollView>

        {/* Sticky Update Button */}
        <View style={styles.stickyButtonContainer}>
          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.updateBtnText}>Update Card</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const GOLD = '#D4AF37';
const SOFT_BG = '#F8F8F8';
const CARD_RADIUS = 18;
const INPUT_RADIUS = 15;
const SHADOW = {
  shadowColor: GOLD,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 6,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SOFT_BG,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  avatarLetter: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    padding: 20,
    ...SHADOW,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: GOLD,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: GOLD,
    marginBottom: 6,
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: INPUT_RADIUS,
    padding: 12,
    marginBottom: 10,
    backgroundColor: SOFT_BG,
    fontSize: 15,
    color: '#222',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#888',
    borderColor: '#e0e0e0',
  },
  stickyButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    padding: 16,
    alignItems: 'center',
  },
  updateBtn: {
    backgroundColor: GOLD,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    ...SHADOW,
    width: Dimensions.get('window').width - 32,
    maxWidth: 500,
  },
  updateBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
