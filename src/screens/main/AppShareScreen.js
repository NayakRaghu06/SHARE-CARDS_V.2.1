import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ClassicTemplate from '../../components/templates/ClassicTemplate';
import ModernTemplate from '../../components/templates/ModernTemplate';
import DarkTemplate from '../../components/templates/DarkTemplate';

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  dark: DarkTemplate,
};

export default function AppShareScreen({ navigation, route }) {
  const { cardData } = route.params;

  const TemplateComponent =
    TEMPLATE_COMPONENTS[cardData?.template] || ClassicTemplate;

  const handleWhatsApp = async () => {
    const phone = cardData.phone || cardData.whatsapp || '';
    if (!phone) return;
    const cardLink = `https://sharecards.in/card/${phone}`;
    const message = `Check my Digital Business Card 👇\n\n${cardLink}`;
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open WhatsApp');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shared Card</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* CARD: show saved image if available, else render template */}
        {cardData?.savedImage ? (
          <Image
            source={{ uri: cardData.savedImage }}
            style={styles.cardImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.templateWrapper}>
            <TemplateComponent userData={cardData} />
          </View>
        )}

        {/* CONTACT INFO */}
        <View style={styles.infoBox}>
          {cardData?.name ? (
            <Text style={styles.infoName}>{cardData.name}</Text>
          ) : null}
          {cardData?.designation || cardData?.role ? (
            <Text style={styles.infoRole}>{cardData.designation || cardData.role}</Text>
          ) : null}
          {cardData?.companyName || cardData?.company ? (
            <Text style={styles.infoCompany}>{cardData.companyName || cardData.company}</Text>
          ) : null}
          {cardData?.phone ? (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color="#555" />
              <Text style={styles.infoText}> {cardData.phone}</Text>
            </View>
          ) : null}
          {cardData?.email ? (
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} color="#555" />
              <Text style={styles.infoText}> {cardData.email}</Text>
            </View>
          ) : null}
          {cardData?.website ? (
            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={16} color="#555" />
              <Text style={styles.infoText}> {cardData.website}</Text>
            </View>
          ) : null}
        </View>

        {/* SHARE ON WHATSAPP */}
        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.whatsappText}>  Share on WhatsApp</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },

  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  cardImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#e8e8e8',
  },

  templateWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },

  infoName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },

  infoRole: {
    fontSize: 14,
    color: '#2563EB',
    marginBottom: 2,
  },

  infoCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  infoText: {
    fontSize: 14,
    color: '#444',
  },

  whatsappBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 3,
  },

  whatsappText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
