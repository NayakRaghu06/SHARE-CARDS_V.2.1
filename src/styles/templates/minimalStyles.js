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
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet, Alert } from "react-native";
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const MinimalTemplate = ({ data, userData, landscape }) => {
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
          <Text style={styles.name}>{d?.name || 'Your Name'}</Text>
          <Text style={styles.role}>{d?.designation || ''}</Text>
          {d?.companyName && (
            <Text style={styles.company}>{d.companyName}</Text>
          )}
        </View>

        <View style={styles.rightSection}>
          <FieldBox label="Mobile" value={d?.phone || ''} />
          <FieldBox label="Email" value={d?.email || ''} />
          <FieldBox label="Website" value={d?.website || ''} />
          {d?.address && <FieldBox label="Address" value={d.address} />}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {d?.companyLogo ? (
        <Image source={{ uri: d.companyLogo }} style={styles.companyLogo} />
      ) : null}

      <View style={styles.avatar}>
        {d?.profileImage ? (
          <Image source={{ uri: d.profileImage }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{initial}</Text>
        )}
      </View>

      <Text style={styles.name}>{d?.name || 'Your Name'}</Text>
      <Text style={styles.role}>{d?.designation || ''}</Text>
      {d?.companyName && (
        <Text style={styles.company}>{d.companyName}</Text>
      )}

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
  rightSection: { 
    flex: 1,
    paddingLeft: 10,
  },
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
    right: 12,
    top: 12,
    width: 80,
    height: 48,
    resizeMode: 'contain',
    zIndex: 5,
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
    color: "#E5E5E5",
    marginBottom: 16,
  },
  company: {
    fontSize: 14,
    color: '#F8EFD0',
    marginBottom: 6,
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    marginHorizontal: 6,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)'
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
});
