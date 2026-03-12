import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import ExpandableField from '../common/ExpandableField';

const MinimalTemplate = ({ data, userData, landscape }) => {
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

      if (uri && String(uri).startsWith('data:')) {
        const base64 = uri.split(',')[1] || '';
        const file = new File(Paths.cache, `temp_${Date.now()}.pdf`);
        try {
          await file.write(base64, { encoding: 'base64' });
        } catch (e) {
          await file.create({ intermediates: true, overwrite: true });
          await file.write(base64, { encoding: 'base64' });
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
      Alert.alert('Error opening PDF', e?.message || String(e));
    }
  };

  // LANDSCAPE VIEW
  if (landscape) {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.leftSection}>
          <View style={styles.avatar}>
            {d?.profileImage ? (
              <Image source={{ uri: d.profileImage }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initial}</Text>
            )}
          </View>

          <ExpandableField label="Name" value={d?.name || 'Your Name'} fieldKey="name" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} valueStyle={styles.name} />
          <ExpandableField label="Designation" value={d?.designation || 'Your Role'} fieldKey="designation" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} valueStyle={styles.role} />
          {d?.companyName ? (
            <ExpandableField label="Company Name" value={d.companyName} fieldKey="companyName" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} valueStyle={styles.company} />
          ) : null}
          {d?.businessCategory || d?.category ? (
            <ExpandableField label="Business Category" value={d.businessCategory || d.category} fieldKey="businessCategory" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={{ marginBottom: 6 }} valueStyle={styles.company} />
          ) : null}
        </View>

        <View style={styles.rightSection}>
          {/* hidden fields shown when expanded */}
          {expanded ? (
            <>
              <ExpandableField label="Business Description" value={d?.description || d?.businessDescription || ''} fieldKey="businessDescription" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
              <ExpandableField label="Mobile" value={d?.phone || ''} fieldKey="mobile" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => d?.phone && Linking.openURL(`tel:${d.phone}`)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
              <ExpandableField label="Email" value={d?.email || ''} fieldKey="email" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => d?.email && Linking.openURL(`mailto:${d.email}`)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
              <ExpandableField label="Website" value={d?.website || ''} fieldKey="website" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => d?.website && Linking.openURL(d.website)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
              <ExpandableField label="Address" value={d?.address || ''} fieldKey="address" expandedField={expandedField} setExpandedField={setExpandedField} onPressAction={() => d?.address && Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
            </>
          ) : null}

          <View style={styles.socialRow}>
            {d?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
            {d?.website ? (<TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
          </View>
        </View>
      </View>
    );
  }

  // NORMAL VIEW
  return (
    <View style={styles.container}>
      <View style={styles.topOval} />

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
        <ExpandableField label="Name" value={d?.name || '-'} fieldKey="name" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={[styles.value, styles.nameValue]} />
        {d?.designation ? <ExpandableField label="Designation" value={d.designation} fieldKey="designation" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={[styles.value, styles.designationValue]} /> : null}
        {d?.companyName ? (
          <ExpandableField label="Company Name" value={d.companyName} fieldKey="companyName" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={[styles.value, styles.companyValue]} />
        ) : null}
        {d?.businessCategory || d?.category ? (
          <ExpandableField label="Business Category" value={d.businessCategory || d.category} fieldKey="businessCategory" expandedField={expandedField} setExpandedField={setExpandedField} containerStyle={styles.fieldBox} labelStyle={styles.label} valueStyle={styles.value} />
        ) : null}
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
      </View>

      {d?.qrCodeImage ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: d.qrCodeImage }} style={styles.qrImageCentered} />
        </View>
      ) : null}

      <View style={styles.socialRow}>
        {phone ? (<TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.iconBtn}><Ionicons name="call" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.website ? (<TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.descriptionPdf ? (<TouchableOpacity onPress={() => handlePdf(d.descriptionPdf)} style={styles.iconBtn}><Ionicons name="document" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.address ? (<TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} style={styles.iconBtn}><Ionicons name="location" size={18} color="#D4AF37" /></TouchableOpacity>) : null}
      </View>
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.85} style={{ marginTop: 12, alignSelf: 'stretch', paddingVertical: 10, alignItems: 'center' }}>
        <Text style={{ color: '#D4AF37', fontWeight: '700', fontSize: 15 }}>{expanded ? 'Show Less' : 'More'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MinimalTemplate;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },
  leftSection: { flex: 1 },
  rightSection: { flex: 1 },

  container: {
    margin: 16,
    paddingTop: 120,
    paddingBottom: 26,
    paddingHorizontal: 26,
    borderRadius: 24,
    backgroundColor: "#0F0F0F",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    alignItems: 'center'
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#D4AF37",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 34,
    color: "#D4AF37",
    fontWeight: "bold",
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },

  companyLogo: {
    position: 'absolute',
    left: 16,
    top: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    resizeMode: 'cover',
    zIndex: 5,
  },
  avatarOuter: {
    position: 'absolute',
    top: 34,
    left: '50%',
    marginLeft: -44,
    borderWidth: 3,
    borderColor: '#D4AF37',
    borderRadius: 48,
    padding: 4,
    marginBottom: 12,
    zIndex: 10,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#0B1023',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOval: {
    position: 'absolute',
    top: 18,
    left: '6%',
    width: '88%',
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#D4AF37',
    zIndex: 1,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarText: {
    fontSize: 34,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  fieldsContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 0,
  },
  fieldBox: {
    width: '100%',
    backgroundColor: '#0E131A',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    width: '40%',
    color: '#EDEDED',
    fontWeight: '800',
    fontSize: 14,
    marginRight: 8,
  },
  value: {
    width: '100%',
    color: '#D1D5DB',
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
    color: "#D4AF37",
    fontWeight: "bold",
  },
  role: {
    fontSize: 16,
    color: "#D1D5DB",
    fontWeight: "600",
  },
  company: {
    fontSize: 16,
    color: "#D1D5DB",
    fontWeight: "600",
  },
  iconBtn: {
    marginHorizontal: 6,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)'
  }
});
