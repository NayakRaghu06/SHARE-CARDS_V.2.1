import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, LayoutAnimation, Platform, UIManager } from "react-native";
import ExpandableField from '../common/ExpandableField';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BURGUNDY_BG_1 = '#2B0A12';
const BURGUNDY_BG_2 = '#5A1425';
const BURGUNDY_CARD = '#3C0F1C';
const BURGUNDY_PANEL = '#4A1327';
const BURGUNDY_DEEP = '#2A0814';
const BURGUNDY_BORDER = '#5A1425';
const GOLD = '#E6B800';
const CARD_TEXT = '#FFFFFF';

const ClassicTemplate = ({ userData, data }) => {
  const d = data || userData || {};
  // enable LayoutAnimation on Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental && !global?.nativeFabricUIManager) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((s) => {
      const next = !s;
      if (!next) setExpandedField(null);
      return next;
    });
  };
  const [expandedField, setExpandedField] = useState(null);
  const phone = d.phone || d.mobile || d.phoneNumber || d.phoneNumber1 || null;
  const phone2 = d.phone2 || d.phoneNumber2 || null;
  const profileImage = d.profileImage || d.photo || null;
  const companyLogo = d.companyLogo || d.logo || null;
  const qrCodeImage = d.qrCodeImage || d.qrImage || null;
  const qrCodeImage2 = d.qrCodeImage2 || d.qrImage2 || null;
  const descriptionPdf = d.descriptionPdf || d.businessPdf || null;
  const whatsappValue = d.whatsapp || d.whatsappUrl || null;
  const whatsappText = whatsappValue == null ? '' : String(whatsappValue);
  const clients = d.clients || d.clientList || null;
  const businessSubCategory = d.businessSubCategory || d.businessSubcategory || null;
  const initial = d?.name ? d.name.trim().charAt(0).toUpperCase() : 'Y';

  const handlePdf = async (pdf) => {
    if (!pdf) return;
    try {
      let uri = typeof pdf === 'string' ? pdf : (pdf.uri || pdf.fileUri || pdf.localUri || pdf.path || pdf.url || null);

      // handle base64 data URIs
      if (uri && uri.startsWith('data:')) {
        const base64 = uri.split(',')[1];
        const file = new File(Paths.cache, `temp_${Date.now()}.pdf`);
        try {
          file.write(base64, { encoding: 'base64' });
        } catch (e) {
          file.create({ intermediates: true, overwrite: true });
          file.write(base64, { encoding: 'base64' });
        }
        uri = file.uri;
      }

      const available = await Sharing.isAvailableAsync();
      if (available) {
        // prefer sharing for local files, but Sharing can accept remote urls on some platforms
        await Sharing.shareAsync(uri);
        return;
      }

      // fallback to opening in browser or external app
      const supported = uri && await Linking.canOpenURL(uri);
      if (supported) await Linking.openURL(uri);
      else Alert.alert('Cannot open PDF', 'No handler available for this PDF.');
    } catch (e) {
      Alert.alert('Error opening PDF', e.message || String(e));
    }
  };

  return (
    <LinearGradient colors={[BURGUNDY_BG_1, BURGUNDY_BG_2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardBg}>
    <View style={styles.card}>
      {/* Company logo fixed top-left */}
      {companyLogo ? (
        <Image source={{ uri: companyLogo }} style={styles.companyLogo} />
      ) : null}

      {/* Neon Circle Avatar */}
      <View style={styles.avatarOuter}>
        <View style={styles.avatarInner}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
      </View>

      {/* Title block removed to avoid duplication; labeled fields shown below */}

      {/* Uniform field boxes for all fields */}
      <View style={styles.fieldsContainer}>
        <ExpandableField label="Name" value={d?.name || '-'} fieldKey="name" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
        {d?.designation ? (
          <ExpandableField label="Designation" value={d.designation} fieldKey="designation" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
        ) : null}
        {d?.companyName ? (
          <ExpandableField label="Company Name" value={d.companyName} fieldKey="companyName" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
        ) : null}
        {d?.businessCategory || d?.category ? (
          <ExpandableField label="Business Category" value={d.businessCategory || d.category} fieldKey="businessCategory" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
        ) : null}
        {businessSubCategory ? (
          <ExpandableField label="Business Subcategory" value={businessSubCategory} fieldKey="businessSubCategory" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
        ) : null}
        {expanded && (
          <>
            {d?.description || d?.businessDescription ? (
              <ExpandableField label="Business Description" value={d.description || d.businessDescription} fieldKey="businessDescription" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            ) : null}
            {phone ? (
              <ExpandableField label="Mobile" value={phone} fieldKey="mobile" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => Linking.openURL(`tel:${phone}`)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            ) : null}
            {d?.email ? (
              <ExpandableField label="Email" value={d.email} fieldKey="email" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => Linking.openURL(`mailto:${d.email}`)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            ) : null}
            {phone2 ? (
              <ExpandableField label="Mobile 2" value={phone2} fieldKey="mobile2" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => Linking.openURL(`tel:${phone2}`)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            ) : null}
            {clients ? (
              <ExpandableField label="Clients" value={clients} fieldKey="clients" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            ) : null}
            {d?.website ? (
              <ExpandableField label="Website" value={d.website} fieldKey="website" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => Linking.openURL(d.website)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            ) : null}
            {d?.address ? (
              <ExpandableField label="Address" value={d.address} fieldKey="address" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            ) : null}
          </>
        )}
      </View>

      {/* QR Code - uploaded image (auto-generated QR disabled) */}
      {qrCodeImage ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: qrCodeImage }} style={styles.qrImageCentered} />
        </View>
      ) : null}
      {qrCodeImage2 ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: qrCodeImage2 }} style={styles.qrImageCentered} />
        </View>
      ) : null}

      <View style={styles.socialRow}>
        {phone ? (<TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.iconBtn}><Ionicons name="call" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {phone2 ? (<TouchableOpacity onPress={() => Linking.openURL(`tel:${phone2}`)} style={styles.iconBtn}><Ionicons name="call-outline" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {whatsappValue ? (<TouchableOpacity onPress={() => Linking.openURL(whatsappText.startsWith('http') ? whatsappText : `https://wa.me/${whatsappText.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(d.instagram.startsWith('http') ? d.instagram : `https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.website ? (<TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {descriptionPdf ? (<TouchableOpacity onPress={() => handlePdf(descriptionPdf)} style={styles.iconBtn}><Ionicons name="document" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.address ? (<TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} style={styles.iconBtn}><Ionicons name="location" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
      </View>
      {/* More / Show Less toggle */}
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.85} style={{ marginTop: 12, alignSelf: 'stretch', paddingVertical: 10, alignItems: 'center' }}>
        <Text style={{ color: GOLD, fontWeight: '700' }}>{expanded ? 'Show Less' : 'More'}</Text>
      </TouchableOpacity>
      {/* visiting card removed (no longer used) */}
    </View>
    </LinearGradient>
  );
};

export default ClassicTemplate;

const styles = StyleSheet.create({
  cardBg: {
    margin: 16,
    borderRadius: 22,
    padding: 2,
    alignSelf: 'center',
    width: '92%',
    maxWidth: 720,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 12,
  },
  card: {
    paddingTop: 20,
    paddingBottom: 22,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: BURGUNDY_CARD,
    borderWidth: 1,
    borderColor: BURGUNDY_BORDER,
    alignItems: "center",
    width: '100%',
  },
  avatarOuter: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 1.5,
    borderColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 14,
    backgroundColor: 'transparent',
  },
  avatarInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: BURGUNDY_DEEP,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    color: GOLD,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  companyLogo: {
    position: 'absolute',
    left: 14,
    top: 14,
    width: 70,
    height: 70,
    borderRadius: 10,
    overflow: 'hidden',
    resizeMode: 'contain',
    zIndex: 5,
    backgroundColor: BURGUNDY_DEEP,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.45)',
  },
  qrImage: {
    width: 80,
    height: 80,
    marginTop: 12,
    alignSelf: 'center',
  },
  qrContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  qrImageCentered: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  role: {
    fontSize: 16,
    color: "#00E5FF",
    marginBottom: 18,
  },
  company: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 12,
  },
  /* unified field box used for all data rows */
  fieldBox: {
    width: '100%',
    backgroundColor: BURGUNDY_PANEL,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BURGUNDY_BORDER,
  },
  info: {
    color: "#E5E7EB",
    fontSize: 15,
    textAlign: 'left',
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    flexWrap: 'wrap',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BURGUNDY_DEEP,
    borderWidth: 1,
    borderColor: BURGUNDY_BORDER,
    marginBottom: 10,
  },
  scannedCard: {
    width: '100%',
    height: 90,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannedCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  /* new alignment styles */
  fieldsContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  label: {
    color: CARD_TEXT,
    fontWeight: '700',
    fontSize: 12,
  },
  value: {
    color: CARD_TEXT,
    fontSize: 12,
    lineHeight: 17,
  },
});
