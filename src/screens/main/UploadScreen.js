import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Note: `react-native-image-picker` is optional. We dynamically import it
// at runtime and show an install hint if it's not available, avoiding
// bundling-time resolution errors when the package is not installed.

const UploadScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [scannerImage, setScannerImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalField, setModalField] = useState(null);
  const [modalInput, setModalInput] = useState('');

  const pickImage = async (setter) => {
    try {
      // dynamic import so bundler doesn't fail when module is missing
      const picker = await import('react-native-image-picker');
      const res = await picker.launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (res?.didCancel) return;
      if (res?.errorCode) {
        Alert.alert('Image error', res.errorMessage || 'Unable to pick image');
        return;
      }
      const asset = res?.assets && res.assets[0];
      if (asset?.uri) setter(asset.uri);
    } catch (e) {
      // Module not installed or runtime error
      Alert.alert(
        'Image Picker Unavailable',
        'Optional package `react-native-image-picker` is not installed or failed to load.\n\nYou can either:\n• Install it: `npm install react-native-image-picker` and follow native setup, or\n• Paste an image URI manually by tapping the placeholder and entering a URL.',
        [{ text: 'OK' }]
      );
    }
  };

  const openManualInput = (field, setter) => {
    setModalField({ field, setter });
    setModalInput('');
    setModalVisible(true);
  };

  const applyManualInput = () => {
    if (modalField && modalField.setter && modalInput.trim()) {
      modalField.setter(modalInput.trim());
    }
    setModalVisible(false);
  };

  useEffect(() => {
    let mounted = true;
    if (profileImage && scannerImage && mounted) {
      setLoading(true);
      // Prepare userData (replace with real extraction logic as needed)
      const userData = {
        name: 'John Doe',
        designation: 'Professional',
        phone: '+91 90000 00000',
        email: 'john.doe@example.com',
        website: 'example.com',
        address: 'Noida, India',
        profileImage: profileImage,
        scannerImage: scannerImage,
      };

      // Small delay to show loader; then navigate to TemplatePreview
      const t = setTimeout(() => {
        if (!mounted) return;
        setLoading(false);
        navigation.navigate('TemplatePreview', { cardData: userData });
      }, 600);

      return () => {
        mounted = false;
        clearTimeout(t);
      };
    }
    return () => { mounted = false; };
  }, [profileImage, scannerImage, navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Upload Images</Text>

        <View style={styles.uploadRow}>
          <TouchableOpacity style={styles.uploadBox} onPress={() => { console.log('tap profile'); pickImage(setProfileImage); }}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.placeholderText}>P</Text>
              </View>
            )}
            <Text style={styles.uploadLabel}>Profile Photo</Text>
            <TouchableOpacity onPress={() => openManualInput('profileImage', setProfileImage)} style={{ marginTop: 6 }}>
              <Text style={{ color: '#2563EB', fontSize: 12 }}>Paste image URL</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadBox} onPress={() => { console.log('tap scanner'); pickImage(setScannerImage); }}>
            {scannerImage ? (
              <Image source={{ uri: scannerImage }} style={styles.scannerPreview} />
            ) : (
              <View style={styles.placeholderScanner}>
                <Text style={styles.placeholderText}>S</Text>
              </View>
            )}
            <Text style={styles.uploadLabel}>Scanner Image</Text>
            <TouchableOpacity onPress={() => openManualInput('scannerImage', setScannerImage)} style={{ marginTop: 6 }}>
              <Text style={{ color: '#2563EB', fontSize: 12 }}>Paste image URL</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.hintRow}>
          <Text style={styles.hint}>Both images uploaded will auto-open the card preview.</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, !(profileImage && scannerImage) && styles.buttonDisabled]}
            onPress={() => navigation.navigate('TemplatePreview', { cardData: {
              name: 'John Doe',
              designation: 'Professional',
              phone: '+91 90000 00000',
              email: 'john.doe@example.com',
              website: 'example.com',
              address: 'Noida, India',
              profileImage,
              scannerImage,
            } })}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Open Preview (manual)</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Paste image URL</Text>
            <TextInput value={modalInput} onChangeText={setModalInput} placeholder="https://..." style={{ borderWidth: 1, borderColor: '#E5E7EB', padding: 8, borderRadius: 6 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginRight: 12 }}>
                <Text style={{ color: '#6B7280' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={applyManualInput}>
                <Text style={{ color: '#111827', fontWeight: '700' }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, padding: 16, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginVertical: 12, color: '#111' },
  uploadRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  uploadBox: { flex: 1, alignItems: 'center', marginHorizontal: 8 },
  avatar: { width: 120, height: 120, borderRadius: 60, resizeMode: 'cover' },
  scannerPreview: { width: 120, height: 80, borderRadius: 8, resizeMode: 'cover' },
  placeholderAvatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  placeholderScanner: { width: 120, height: 80, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 28, color: '#9CA3AF', fontWeight: '700' },
  uploadLabel: { marginTop: 8, fontSize: 14, color: '#374151' },
  hintRow: { marginTop: 20 },
  hint: { color: '#6B7280', textAlign: 'center' },
  actions: { marginTop: 30, width: '100%' },
  button: { backgroundColor: '#111827', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#FFF', fontWeight: '700' },
});
