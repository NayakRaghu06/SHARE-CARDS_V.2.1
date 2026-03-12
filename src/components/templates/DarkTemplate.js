import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, LayoutAnimation, Platform, UIManager } from "react-native";
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import ExpandableField from '../common/ExpandableField';
import { LinearGradient } from 'expo-linear-gradient';

const DARK_BG_1 = '#0B132B';
const DARK_BG_2 = '#1C2541';
const DARK_BG_3 = '#1C2541';
const DARK_CARD = '#0A0F1F';
const DARK_ACCENT = '#F5B301';
const DARK_TEXT = '#FFFFFF';

const DarkTemplate = ({ userData, data }) => {
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
    } catch (e) { Alert.alert('Error opening PDF', e.message || String(e)); }
  };

  return (
    <LinearGradient colors={[DARK_BG_1, DARK_BG_2, DARK_BG_3]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardBg}>
    <View style={styles.card}>
      {d?.companyLogo ? (
        <Image source={{ uri: d.companyLogo }} style={styles.companyLogo} />
      ) : null}

      <View style={styles.avatarOuter}>
        <View style={styles.avatarInner}>
          {d?.profileImage ? (
            <Image source={{ uri: d.profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
      </View>

      <View style={styles.fieldsContainer}>
        <ExpandableField label="Name" value={d?.name || '-'} fieldKey="name" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={[styles.value, styles.nameValue]} />
        {d?.designation ? (
          <ExpandableField label="Designation" value={d.designation} fieldKey="designation" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={[styles.value, styles.designationValue]} />
        ) : null}
        {d?.companyName ? (
          <ExpandableField label="Company Name" value={d.companyName} fieldKey="companyName" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={[styles.value, styles.companyValue]} />
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

      <View style={styles.socialRow}>
        {phone ? (<TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.iconBtn}><Ionicons name="call" size={18} color={DARK_ACCENT} /></TouchableOpacity>) : null}
        {d?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color={DARK_ACCENT} /></TouchableOpacity>) : null}
        {d?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color={DARK_ACCENT} /></TouchableOpacity>) : null}
        {d?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(d.instagram.startsWith('http') ? d.instagram : `https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color={DARK_ACCENT} /></TouchableOpacity>) : null}
        {d?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color={DARK_ACCENT} /></TouchableOpacity>) : null}
        {d?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color={DARK_ACCENT} /></TouchableOpacity>) : null}
        {d?.website ? (<TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color={DARK_ACCENT} /></TouchableOpacity>) : null}
        {d?.descriptionPdf ? (<TouchableOpacity onPress={() => handlePdf(d.descriptionPdf)} style={styles.iconBtn}><Ionicons name="document" size={18} color={DARK_ACCENT} /></TouchableOpacity>) : null}
        {d?.address ? (<TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} style={styles.iconBtn}><Ionicons name="location" size={18} color={DARK_ACCENT} /></TouchableOpacity>) : null}
      </View>
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.85} style={{ marginTop: 12, alignSelf: 'stretch', paddingVertical: 10, alignItems: 'center' }}>
        <Text style={{ color: DARK_TEXT, fontWeight: '700', fontSize: 15 }}>{expanded ? 'Show Less' : 'More'}</Text>
      </TouchableOpacity>
      {/* visiting card removed */}
    </View>
    </LinearGradient>
  );
};

export default DarkTemplate;

const styles = StyleSheet.create({
  cardBg: {
    margin: 16,
    borderRadius: 22,
    padding: 2,
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
    backgroundColor: DARK_CARD,
    alignItems: "center",
  },
  avatarOuter: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 1.5,
    borderColor: DARK_ACCENT,
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
    backgroundColor: '#0E1A33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 34,
    color: DARK_ACCENT,
    fontWeight: "bold",
  },
  profileImage: {
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
    backgroundColor: '#13223F',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.45)',
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
    color: "#FFF",
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#06B6D4",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    marginVertical: 10,
  },
  role: {
    color: "#000",
    fontWeight: "bold",
  },
  company: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  description: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#0F172A",
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
  },
  info: {
    color: DARK_TEXT,
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
    backgroundColor: '#13223F',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
    marginBottom: 10,
  },
  /* new unified styles */
  fieldsContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  fieldBox: {
    width: '100%',
    backgroundColor: '#13223F',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.28)',
  },
  label: {
    color: DARK_TEXT,
    fontWeight: '700',
    fontSize: 14,
  },
  value: {
    color: DARK_TEXT,
    fontSize: 16,
    lineHeight: 20,
  },
  nameValue: {
    fontSize: 18,
    lineHeight: 22,
  },
  designationValue: {
    fontSize: 16,
    lineHeight: 20,
  },
  companyValue: {
    fontSize: 16,
    lineHeight: 20,
  },
  scannedCard: {
    width: '100%',
    height: 90,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannedCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
