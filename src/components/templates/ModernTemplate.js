import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, LayoutAnimation, Platform, UIManager } from "react-native";
import ExpandableField from '../common/ExpandableField';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MODERN_GRADIENT_START = '#6A11CB';
const MODERN_GRADIENT_END = '#2575FC';
const MODERN_CARD_WHITE = '#FFFFFF';
const MODERN_ACCENT = '#6A11CB';
const MODERN_TEXT = '#FFFFFF';

const ModernTemplate = ({ userData, data }) => {
  const d = data || userData || {};
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
  const phone = d.phone || d.mobile || null;
  const initial = d?.name ? d.name.trim().charAt(0).toUpperCase() : 'Y';

  const handlePdf = async (pdf) => {
    if (!pdf) return;
    try {
      let uri = typeof pdf === 'string' ? pdf : (pdf.uri || pdf.fileUri || pdf.localUri || pdf.path || pdf.url || null);

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
        await Sharing.shareAsync(uri);
        return;
      }

      const supported = uri && await Linking.canOpenURL(uri);
      if (supported) await Linking.openURL(uri);
      else Alert.alert('Cannot open PDF', 'No handler available for this PDF.');
    } catch (e) {
      Alert.alert('Error opening PDF', e.message || String(e));
    }
  };

  return (
    <LinearGradient colors={[MODERN_GRADIENT_START, MODERN_GRADIENT_END]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      {d?.companyLogo ? (
        <Image source={{ uri: d.companyLogo }} style={styles.companyLogo} />
      ) : null}

      <View style={styles.avatarOuter}>
        <View style={styles.avatarInner}>
          {d?.profileImage ? (
            <Image source={{ uri: d.profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
      </View>

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

            {d?.website ? (
              <ExpandableField label="Website" value={d.website} fieldKey="website" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => Linking.openURL(d.website)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            ) : null}

            {d?.address ? (
              <ExpandableField label="Address" value={d.address} fieldKey="address" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            ) : null}
          </>
        )}
      </View>

      {d?.qrCodeImage ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: d.qrCodeImage }} style={styles.qrImageCentered} />
        </View>
      ) : null}

      {/* Social icons */}
      <View style={styles.socialRow}>
        {phone ? (<TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.iconBtn}><Ionicons name="call" size={20} color={MODERN_ACCENT} /></TouchableOpacity>) : null}
        {d?.whatsapp ? (
          <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={20} color={MODERN_ACCENT} /></TouchableOpacity>
        ) : null}
        {d?.linkedin ? (
          <TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={20} color={MODERN_ACCENT} /></TouchableOpacity>
        ) : null}
        {d?.instagram ? (
          <TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={20} color={MODERN_ACCENT} /></TouchableOpacity>
        ) : null}
        {d?.twitter ? (
          <TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={20} color={MODERN_ACCENT} /></TouchableOpacity>
        ) : null}
        {d?.facebook ? (
          <TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={20} color={MODERN_ACCENT} /></TouchableOpacity>
        ) : null}
        {d?.website ? (
          <TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={20} color={MODERN_ACCENT} /></TouchableOpacity>
        ) : null}
        {d?.descriptionPdf ? (
          <TouchableOpacity onPress={() => handlePdf(d.descriptionPdf)} style={styles.iconBtn}><Ionicons name="document" size={20} color={MODERN_ACCENT} /></TouchableOpacity>
        ) : null}
        {d?.address ? (<TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} style={styles.iconBtn}><Ionicons name="location" size={20} color={MODERN_ACCENT} /></TouchableOpacity>) : null}
      </View>
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.85} style={{ marginTop: 12, alignSelf: 'stretch', paddingVertical: 10, alignItems: 'center' }}>
        <Text style={{ color: MODERN_TEXT, fontWeight: '700' }}>{expanded ? 'Show Less' : 'More'}</Text>
      </TouchableOpacity>
      {/* visiting card removed */}
    </LinearGradient>
  );
};

export default ModernTemplate;

const styles = StyleSheet.create({
  card: {
    margin: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  avatarOuter: {
    borderWidth: 4,
    borderColor: MODERN_ACCENT,
    borderRadius: 48,
    padding: 4,
    marginBottom: 12,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MODERN_CARD_WHITE,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  companyLogo: {
    position: 'absolute',
    left: 12,
    top: 12,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    resizeMode: 'cover',
    backgroundColor: MODERN_CARD_WHITE,
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
  avatarText: {
    fontSize: 36,
    color: MODERN_ACCENT,
    fontWeight: "bold",
  },
  nameBox: {
    backgroundColor: 'rgba(212,175,55,0.18)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 18,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  role: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },
  company: {
    fontSize: 14,
    color: MODERN_TEXT,
    textAlign: 'center',
    marginTop: 6,
  },
  description: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
  },
  info: {
    fontSize: 16,
    color: MODERN_TEXT,
    marginVertical: 5,
    textAlign: 'left',
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconBtn: {
    marginHorizontal: 6,
    padding: 6,
    borderRadius: 8,
    backgroundColor: MODERN_CARD_WHITE,
    borderWidth: 1,
    borderColor: 'rgba(106,17,203,0.45)',
  }
  ,
  /* unified styles */
  fieldsContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 0,
  },
  fieldBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    color: MODERN_TEXT,
    fontWeight: '800',
    fontSize: 11,
  },
  value: {
    color: MODERN_TEXT,
    fontSize: 11,
    lineHeight: 18,
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
});
