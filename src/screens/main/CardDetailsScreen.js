import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClassicTemplate from '../../components/templates/ClassicTemplate';
import ModernTemplate from '../../components/templates/ModernTemplate';
import DarkTemplate from '../../components/templates/DarkTemplate';
import AppHeader from '../../components/common/AppHeader';

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  dark: DarkTemplate,
};

export default function CardDetailsScreen({ route }) {
  const { cardId, cardData = {} } = route.params || {};
  const SelectedComponent = TEMPLATE_COMPONENTS[cardData.templateSlug || cardData.template] || ClassicTemplate;

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
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scroll}>
        <SelectedComponent userData={normalizedData} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
