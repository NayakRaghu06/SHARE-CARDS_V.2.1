import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ClassicTemplate from '../../components/templates/ClassicTemplate';
import ModernTemplate from '../../components/templates/ModernTemplate';
import DarkTemplate from '../../components/templates/DarkTemplate';

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  dark: DarkTemplate,
};

export default function SavedCardViewScreen({ route, navigation }) {
  const cardData = route?.params?.cardData || {};
  const template = cardData.templateSlug || cardData.template || 'classic';
  const SelectedComponent = TEMPLATE_COMPONENTS[template] || ClassicTemplate;

  // Normalize API field names to match what templates expect
  const normalizedData = {
    ...cardData,
    phone: cardData.phone || cardData.phoneNumber || cardData.phoneNumber1 || cardData.mobile,
    phone2: cardData.phone2 || cardData.phoneNumber2,
    whatsapp: cardData.whatsapp || cardData.whatsappUrl,
    businessSubCategory: cardData.businessSubCategory || cardData.businessSubcategory,
    businessDescription: cardData.businessDescription || cardData.description,
    profileImage: cardData.profileImage || cardData.photo || cardData.profileImageFileId,
    companyLogo: cardData.companyLogo || cardData.logo || cardData.logoFileId,
    qrCodeImage: cardData.qrCodeImage || cardData.qrImage || cardData.qrFileId1,
    qrCodeImage2: cardData.qrCodeImage2 || cardData.qrImage2 || cardData.qrFileId2,
    descriptionPdf: cardData.descriptionPdf || cardData.businessPdf || cardData.pdfFileId,
    clients: cardData.clients || cardData.clientList,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#D4AF37" />
        </TouchableOpacity>

        <Text style={styles.title}>Saved Card</Text>

        <View style={{ width: 36 }} />
      </View>

      <View style={styles.center}>
        <View style={styles.cardWrapper}>
          <SelectedComponent userData={normalizedData} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  backBtn: {
    width: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
  },
});
