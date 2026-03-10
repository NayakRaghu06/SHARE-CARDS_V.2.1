// import { StyleSheet } from 'react-native';
// import colors from '../colors';

// const styles = StyleSheet.create({
//   // Template Selection Mode Styles
//   selectionContainer: {
//     width: 280,
//     height: 440,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     overflow: 'hidden',
//     marginHorizontal: 8,
//   },
//   selected: {
//     borderColor: '#667EEA',
//     borderWidth: 3,
//     shadowColor: '#667EEA',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   selectionGradient: {
//     flex: 1,
//     padding: 16,
//     justifyContent: 'space-between',
//   },
//   selectionHeader: {
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   badge: {
//     backgroundColor: 'rgba(255, 255, 255, 0.25)',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   badgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   selectionContent: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   selectionName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     marginBottom: 6,
//   },
//   selectionTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: 'rgba(255, 255, 255, 0.9)',
//     marginBottom: 20,
//   },
//   selectionContactSection: {
//     marginTop: 16,
//   },
//   selectionContactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 8,
//     padding: 8,
//   },
//   selectionContactValue: {
//     fontSize: 12,
//     color: '#FFFFFF',
//     flex: 1,
//   },

//   // Preview Mode Styles
//   card: {
//     width: '100%',
//     maxWidth: 400,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   headerBackground: {
//     height: 100,
//     backgroundColor: '#667EEA',
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
//     backgroundColor: '#E0E0E0',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 3,
//     borderColor: '#FFFFFF',
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   profileImagePlaceholder: {
//     fontSize: 40,
//     color: '#999',
//   },
//   name: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1A1A1A',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   designation: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#667EEA',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   company: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#666',
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
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   contactLabel: {
//     fontSize: 18,
//     marginRight: 12,
//     minWidth: 28,
//   },
//   contactValue: {
//     fontSize: 13,
//     color: '#333',
//     flex: 1,
//     fontWeight: '500',
//   },
//   socialMediaSection: {
//     borderTopWidth: 1,
//     borderTopColor: '#E0E0E0',
//     paddingTop: 16,
//   },
//   socialLabel: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#667EEA',
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
//     backgroundColor: '#F9F9F9',
//     borderRadius: 6,
//     marginBottom: 8,
//     borderLeftWidth: 3,
//     borderLeftColor: '#667EEA',
//   },
//   socialIconLabel: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#667EEA',
//     marginRight: 10,
//     minWidth: 20,
//     textAlign: 'center',
//   },
//   socialText: {
//     fontSize: 13,
//     color: '#333',
//     flex: 1,
//   },
// });

// export default styles;
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from "react-native";
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const ModernTemplate = ({ userData, data }) => {
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

      <View style={styles.nameBox}>
        <Text style={styles.name}>{d?.name || 'Your Name'}</Text>
        <Text style={styles.role}>{d?.designation || ''}</Text>
        {d?.companyName && (
          <Text style={styles.company}>{d.companyName}</Text>
        )}
      </View>

      <View style={styles.fieldsContainer}>
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
        {phone ? (<TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)} style={styles.iconBtn}><Ionicons name="call" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.whatsapp ? (<TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`)} style={styles.iconBtn}><Ionicons name="logo-whatsapp" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.linkedin ? (<TouchableOpacity onPress={() => Linking.openURL(d.linkedin)} style={styles.iconBtn}><Ionicons name="logo-linkedin" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.instagram ? (<TouchableOpacity onPress={() => Linking.openURL(`https://instagram.com/${d.instagram.replace(/^@/,'')}`)} style={styles.iconBtn}><Ionicons name="logo-instagram" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.twitter ? (<TouchableOpacity onPress={() => Linking.openURL(d.twitter)} style={styles.iconBtn}><Ionicons name="logo-twitter" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.facebook ? (<TouchableOpacity onPress={() => Linking.openURL(d.facebook)} style={styles.iconBtn}><Ionicons name="logo-facebook" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.website ? (<TouchableOpacity onPress={() => Linking.openURL(d.website)} style={styles.iconBtn}><Ionicons name="globe" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.descriptionPdf ? (<TouchableOpacity onPress={() => handlePdf(d.descriptionPdf)} style={styles.iconBtn}><Ionicons name="document" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
        {d?.address ? (<TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`)} style={styles.iconBtn}><Ionicons name="location" size={20} color="#D4AF37" /></TouchableOpacity>) : null}
      </View>
    </View>
  );
};

export default ModernTemplate;

const styles = StyleSheet.create({
  card: {
    margin: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#1F1147",
    borderWidth: 1,
    borderColor: "#2D1B69",
    alignItems: "center",
    alignSelf: 'center',
    width: '92%',
    maxWidth: 720,
    elevation: 12,
    shadowColor: '#FF4081',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  avatarOuter: {
    borderWidth: 4,
    borderColor: "#FF4081",
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
    backgroundColor: '#374151',
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
  },
  avatarText: {
    fontSize: 36,
    color: "#FFF",
    fontWeight: "bold",
  },
  nameBox: {
    backgroundColor: "#FF4081",
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
    color: '#F3E8FF',
    textAlign: 'center',
    marginTop: 6,
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
    backgroundColor: 'rgba(0,0,0,0.15)'
  },
  fieldsContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 6,
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
});
