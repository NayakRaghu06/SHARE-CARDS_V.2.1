import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function openUrl(url) {
  if (!url) return;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) Linking.openURL(url);
      else Alert.alert('Cannot open link', url);
    })
    .catch((e) => Alert.alert('Error', e.message));
}

export default function DigitalCard({ data = {} }) {
  const {
    profileImage,
    profilePhoto,
    name,
    designation,
    companyName,
    businessDescription,
    companyLogo,
    qrCodeImage,
    qrCode,
    phone,
    whatsapp,
    email,
    website,
    linkedin,
    instagram,
    descriptionPdf,
    // address stored under address or location
    address,
  } = data || {};

  const phoneLink = phone ? `tel:${phone}` : null;
  const mailLink = email ? `mailto:${email}` : null;
  const mapsLink = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : null;
  const websiteLink = website || null;

  const openWhatsApp = (num) => {
    if (!num) return;
    const cleaned = num.replace(/\D/g, '');
    const url = `https://wa.me/${cleaned}`;
    openUrl(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            {profileImage || profilePhoto ? (
              <Image source={{ uri: profileImage || profilePhoto }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={36} color="#fff" />
              </View>
            )}
          </View>
          {companyLogo ? (
            <Image source={{ uri: companyLogo }} style={styles.logo} />
          ) : null}
        </View>

        <View style={styles.main}>
          {name ? <Text style={styles.name}>{name}</Text> : null}
          {designation ? <Text style={styles.designation}>{designation}</Text> : null}
          {companyName ? <Text style={styles.company}>{companyName}</Text> : null}

          {businessDescription ? (
            <View style={styles.descriptionWrap}>
              <Text style={styles.description}>{businessDescription}</Text>
            </View>
          ) : null}

          {/* Labeled fields - two-column aligned layout */}
          <View style={styles.labeledBlock}>
            {[
              { label: 'Name', value: name || '—' },
              designation ? { label: 'Designation', value: designation } : null,
              companyName ? { label: 'Company Name', value: companyName } : null,
              businessDescription ? { label: 'Business Description', value: businessDescription } : null,
            ].filter(Boolean).map((item, i) => (
              <View key={i} style={styles.labeledRow}>
                <Text style={styles.labelText}>{item.label}:</Text>
                <Text style={styles.valueText}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.contactRow}>
            {phone ? (
              <TouchableOpacity style={styles.contactItem} onPress={() => openUrl(phoneLink)}>
                <Ionicons name="call" size={18} color="#D4AF37" />
                <Text style={styles.contactText}>{phone}</Text>
              </TouchableOpacity>
            ) : null}

            {email ? (
              <TouchableOpacity style={styles.contactItem} onPress={() => openUrl(mailLink)}>
                <Ionicons name="mail" size={18} color="#D4AF37" />
                <Text style={styles.contactText}>{email}</Text>
              </TouchableOpacity>
            ) : null}

            {address ? (
              <TouchableOpacity style={styles.contactItem} onPress={() => openUrl(mapsLink)}>
                <Ionicons name="location" size={18} color="#D4AF37" />
                <Text style={styles.contactText}>{address}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {websiteLink ? (
            <TouchableOpacity onPress={() => openUrl(websiteLink)} style={styles.websiteWrap}>
              <Ionicons name="globe" size={16} color="#D4AF37" />
              <Text style={styles.websiteText}>{websiteLink}</Text>
            </TouchableOpacity>
          ) : null}

          {qrCodeImage || qrCode ? (
            <View style={styles.qrWrap}>
              <Image source={{ uri: qrCodeImage || qrCode }} style={styles.qr} />
            </View>
          ) : null}
        </View>

        <View style={styles.socialRow}>
          {whatsapp ? (
            <TouchableOpacity onPress={() => openWhatsApp(whatsapp)} style={styles.iconBtn}>
              <Ionicons name="logo-whatsapp" size={22} color="#D4AF37" />
            </TouchableOpacity>
          ) : null}

          {linkedin ? (
            <TouchableOpacity onPress={() => openUrl(linkedin)} style={styles.iconBtn}>
              <Ionicons name="logo-linkedin" size={22} color="#D4AF37" />
            </TouchableOpacity>
          ) : null}

          {instagram ? (
            <TouchableOpacity onPress={() => openUrl(instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram}`)} style={styles.iconBtn}>
              <Ionicons name="logo-instagram" size={22} color="#D4AF37" />
            </TouchableOpacity>
          ) : null}

          {websiteLink ? (
            <TouchableOpacity onPress={() => openUrl(websiteLink)} style={styles.iconBtn}>
              <Ionicons name="globe" size={22} color="#D4AF37" />
            </TouchableOpacity>
          ) : null}

          {descriptionPdf ? (
            <TouchableOpacity onPress={() => openUrl(descriptionPdf.uri || descriptionPdf)} style={styles.iconBtn}>
              <Ionicons name="document" size={22} color="#D4AF37" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarWrap: { marginRight: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee' },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', resizeMode: 'cover' },
  main: { marginTop: 12 },
  name: { fontSize: 18, fontWeight: '700', color: '#111' },
  designation: { fontSize: 14, color: '#444', marginTop: 2 },
  company: { fontSize: 13, color: '#666', marginTop: 4 },
  descriptionWrap: { marginTop: 12, backgroundColor: '#FAFAFA', padding: 10, borderRadius: 8 },
  description: { color: '#333', fontSize: 13, lineHeight: 18 },
  contactRow: { marginTop: 12 },
  contactItem: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  contactText: { marginLeft: 8, color: '#333' },
  labeledBlock: { marginTop: 10, paddingHorizontal: 4 },
  labeledRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
  labelText: { fontWeight: '800', color: '#111', flexShrink: 0, fontSize: 13, letterSpacing: 0.2, marginRight: 8 },
  valueText: { flex: 1, color: '#555', fontSize: 14, marginRight: 20 },
  websiteWrap: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  websiteText: { marginLeft: 8, color: '#1F2937', textDecorationLine: 'underline' },
  qrWrap: { marginTop: 14, alignItems: 'center' },
  qr: { width: 120, height: 120, resizeMode: 'contain' },
  socialRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 14, borderTopWidth: 1, borderTopColor: '#F3F3F3', paddingTop: 12 },
  iconBtn: { padding: 6 },
});
