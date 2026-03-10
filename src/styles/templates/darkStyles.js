// import { StyleSheet } from 'react-native';

// const styles = StyleSheet.create({
//   // Template Selection Mode Styles
//   selectionContainer: {
//     width: 280,
//     height: 440,
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#333333',
//     overflow: 'hidden',
//     marginHorizontal: 8,
//   },
//   selected: {
//     borderColor: '#FFD700',
//     borderWidth: 3,
//     shadowColor: '#FFD700',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   selectionHeader: {
//     backgroundColor: '#242424',
//     padding: 16,
//     paddingBottom: 20,
//   },
//   accentBar: {
//     height: 3,
//     backgroundColor: '#FFD700',
//     borderRadius: 2,
//     marginBottom: 12,
//   },
//   badge: {
//     backgroundColor: '#FFD700',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//     alignSelf: 'flex-start',
//   },
//   badgeText: {
//     color: '#1A1A1A',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   selectionContent: {
//     flex: 1,
//     padding: 16,
//   },
//   selectionName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   selectionTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#FFD700',
//     marginBottom: 12,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#333333',
//     marginVertical: 12,
//   },
//   selectionInfoSection: {
//     gap: 10,
//   },
//   selectionInfoItem: {
//     marginBottom: 4,
//   },
//   infoLabel: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#999999',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//     marginBottom: 3,
//   },
//   selectionInfoValue: {
//     fontSize: 12,
//     color: '#E0E0E0',
//     lineHeight: 16,
//   },
//   footer: {
//     height: 6,
//     backgroundColor: '#FFD700',
//   },

//   // Preview Mode Styles
//   card: {
//     width: '100%',
//     maxWidth: 400,
//     backgroundColor: '#1A1A1A',
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 5,
//     shadowColor: '#FFD700',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//   },
//   headerBackground: {
//     height: 100,
//     backgroundColor: '#242424',
//     borderBottomWidth: 3,
//     borderBottomColor: '#FFD700',
//   },
//   profileSection: {
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: -40,
//     paddingBottom: 20,
//     marginTop: -40,
//   },
//   profileImageContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#333333',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 3,
//     borderColor: '#FFD700',
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#FFD700',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   profileImagePlaceholder: {
//     fontSize: 40,
//     color: '#666',
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   designation: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#FFD700',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   company: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#999',
//     textAlign: 'center',
//   },
//   detailsSection: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   contactInfo: {
//     marginBottom: 20,
//   },
//   contactItem: {
//     flexDirection: 'column',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     backgroundColor: '#242424',
//     borderRadius: 8,
//     marginBottom: 10,
//     borderLeftWidth: 3,
//     borderLeftColor: '#FFD700',
//   },
//   contactValue: {
//     fontSize: 13,
//     color: '#E0E0E0',
//     fontWeight: '500',
//     marginTop: 4,
//   },
//   socialMediaSection: {
//     borderTopWidth: 1,
//     borderTopColor: '#333333',
//     paddingTop: 16,
//   },
//   socialLabel: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#FFD700',
//     marginBottom: 12,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   socialLinksContainer: {
//     marginTop: 8,
//   },
//   socialLink: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#242424',
//     borderRadius: 6,
//     marginBottom: 8,
//     borderLeftWidth: 3,
//     borderLeftColor: '#FFD700',
//   },
//   socialIconLabel: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#FFD700',
//     marginRight: 10,
//     minWidth: 20,
//     textAlign: 'center',
//   },
//   socialText: {
//     fontSize: 13,
//     color: '#E0E0E0',
//     flex: 1,
//   },
// });

// export default styles;
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from "react-native";
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const DarkTemplate = ({ userData, data }) => {
  const d = data || userData || {};
  const phone = d.phone || d.mobile || null;
  const initial = d?.name ? d.name.trim().charAt(0).toUpperCase() : 'Y';
  const [expandedField, setExpandedField] = useState(null);

  const handlePdf = async (pdf) => {
    if (!pdf) return;
    try {
      let uri = typeof pdf === 'string' ? pdf : (pdf.uri || pdf.fileUri || pdf.localUri || pdf.path || pdf.url || null);
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open PDF');
    }
  };

  const toggleField = (fieldName) => {
    setExpandedField(expandedField === fieldName ? null : fieldName);
  };

  const FieldBox = ({ label, value }) => {
    const isExpanded = expandedField === label;
    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => toggleField(label)}
        style={[styles.fieldBox, isExpanded && styles.fieldBoxExpanded]}
      >
        <Text style={styles.label}>{label}</Text>
        <Text 
          style={styles.value}
          numberOfLines={isExpanded ? 0 : 1}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.card}>
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
        <FieldBox label="Name" value={d?.name || '—'} />
        {d?.designation && <FieldBox label="Designation" value={d.designation} />}
        {d?.companyName && <FieldBox label="Company Name" value={d.companyName} />}
        {(d?.description || d?.businessDescription) && (
          <FieldBox 
            label="Business Description" 
            value={d.description || d.businessDescription} 
          />
        )}

        {phone && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(`tel:${phone}`)}>
            <FieldBox label="Mobile" value={phone} />
          </TouchableOpacity>
        )}

        {d?.email && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(`mailto:${d.email}`)}>
            <FieldBox label="Email" value={d.email} />
          </TouchableOpacity>
        )}

        {d?.website && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(d.website)}>
            <FieldBox label="Website" value={d.website} />
          </TouchableOpacity>
        )}

        {d?.address && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)}>
            <FieldBox label="Address" value={d.address} />
          </TouchableOpacity>
        )}
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
    </View>
  );
};

export default DarkTemplate;

const styles = StyleSheet.create({
  card: {
    margin: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#0F1724',
    alignItems: 'center',
    alignSelf: 'center',
    width: '92%',
    maxWidth: 720,
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
    zIndex: 5,
  },
  avatarOuter: {
    borderWidth: 3,
    borderColor: "#D4AF37",
    borderRadius: 48,
    padding: 4,
    marginBottom: 12,
    backgroundColor: 'transparent'
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#0B1023",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 34,
    color: "#D4AF37",
    fontWeight: "bold",
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  fieldsContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 6,
  },
  fieldBox: {
    width: '100%',
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fieldBoxExpanded: {
    paddingVertical: 14,
  },
  label: {
    width: '40%',
    color: '#EDEDED',
    fontWeight: '800',
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  value: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 20,
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
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
});
