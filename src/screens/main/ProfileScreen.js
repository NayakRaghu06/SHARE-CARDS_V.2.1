
import { useState, useEffect, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileStyles } from '../../styles/screens/profileStyles';
import { apiFetch, getApiErrorMessage } from '../../utils/api';
import FS from '../../styles/typography';
import websocketService from '../../utils/websocketService';
import Footer from '../../components/common/Footer';
import { clearUserTable } from '../../database/userQueries';

const THEME = {
  bg: '#F8F9FB',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  primary: '#A62C3B',
  accent: '#D4AF37',
  border: '#E5E7EB',
  headerStart: '#0F172A',
  headerMid: '#111827',
  headerEnd: '#1E293B',
};

export default function ProfileScreen({ navigation, route }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first: '',
    middle: '',
    last: '',
    phone: '',
    email: '',
    profileImage: null,
  });
  const [editedData, setEditedData] = useState({
    first: '',
    middle: '',
    last: '',
    phone: '',
    email: '',
    profileImage: null,
  });
  const [errors, setErrors] = useState({ first: '', last: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [pendingImage, setPendingImage] = useState(null);
  const fromScreen = route?.params?.fromScreen || null;
  const screenFade = useRef(new Animated.Value(0)).current;
  const screenSlide = useRef(new Animated.Value(14)).current;
  const editAnim = useRef(new Animated.Value(0)).current;
  const avatarTap = useRef(new Animated.Value(1)).current;
  const saveTap = useRef(new Animated.Value(1)).current;
  const cancelTap = useRef(new Animated.Value(1)).current;
  const logoutTap = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const { res, data } = await apiFetch('/user/profile');
        if (res.status === 401) {
          await AsyncStorage.multiRemove(['loggedInUserId', 'userPhone', 'activeCardId', 'sessionCookie']);
          Alert.alert('Session expired', getApiErrorMessage(res, data, 'Please log in again.'));
          navigation.replace('Login');
          return;
        }
        if (res.ok && data && data.status === 1 && data.data) {
          const mapped = {
            first: data.data.firstName || '',
            middle: data.data.middleName || '',
            last: data.data.lastName || '',
            phone: data.data.mobileNumber || '',
            email: data.data.email || '',
            profileImage: null,
          };
          setProfileData(mapped);
          setEditedData(mapped);
        } else {
          throw new Error(getApiErrorMessage(res, data, 'Failed to load profile'));
        }
      } catch (error) {
        Alert.alert('Error', error?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(screenSlide, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenFade, screenSlide]);

  useEffect(() => {
    Animated.timing(editAnim, {
      toValue: isEditing ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [isEditing, editAnim]);

  const animatePressIn = (animRef) => {
    Animated.spring(animRef, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 25,
      bounciness: 0,
    }).start();
  };

  const animatePressOut = (animRef) => {
    Animated.spring(animRef, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 5,
    }).start();
  };

  const handleImagePick = async () => {
    Animated.sequence([
      Animated.timing(avatarTap, { toValue: 0.95, duration: 90, useNativeDriver: true }),
      Animated.timing(avatarTap, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Required', 'Please allow gallery access to upload a profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setPendingImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const validateField = (key, value) => {
    const v = value.trim();
    if (key === 'first') {
      if (!v) return 'First name is required';
      if (!/^[a-zA-Z\s]+$/.test(v)) return 'First name can only contain letters';
    }
    if (key === 'last') {
      if (!v) return 'Last name is required';
      if (!/^[a-zA-Z\s]+$/.test(v)) return 'Last name can only contain letters';
    }
    if (key === 'email') {
      if (!v) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address';
    }
    return '';
  };

  const handleEditChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
    if (field !== 'middle' && field !== 'phone') {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleSave = async () => {
    // Validate all required fields before submitting
    const newErrors = {
      first: validateField('first', editedData.first),
      last: validateField('last', editedData.last),
      email: validateField('email', editedData.email),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e !== '')) return;

    try {
      const payload = {
        firstName: editedData.first,
        middleName: editedData.middle,
        lastName: editedData.last,
        email: editedData.email,
      };
      const { res, data } = await apiFetch('/user/update-profile', {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        await AsyncStorage.multiRemove(['loggedInUserId', 'userPhone', 'activeCardId', 'sessionCookie']);
        Alert.alert('Session expired', getApiErrorMessage(res, data, 'Please log in again.'));
        navigation.replace('Login');
        return;
      }
      if (res.ok && data && data.status === 1 && data.data) {
        const mapped = {
          first: data.data.firstName || '',
          middle: data.data.middleName || '',
          last: data.data.lastName || '',
          phone: data.data.mobileNumber || '',
          email: data.data.email || '',
          profileImage: profileData.profileImage,
        };
        setProfileData(mapped);
        setEditedData(mapped);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error(getApiErrorMessage(res, data, 'Failed to update profile'));
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to save profile');
    }
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setErrors({ first: '', last: '', email: '' });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    // Step 1: disconnect websocket
    try { await websocketService.disconnect(); } catch {}

    // Step 2: invalidate session on backend
    try { await apiFetch('/auth/logout', { method: 'POST' }); } catch {}

    // Step 3: wipe ALL local auth state
    try {
      await AsyncStorage.multiRemove([
        'loggedInUserId',
        'userPhone',
        'activeCardId',
        'sessionCookie',
        'otpSessionId',
        'shareCardTemp',
        'cachedCards',
        'userSession',
        'loggedInUser',
      ]);
      clearUserTable();
    } catch {}

    // Step 4: reset navigation stack to Login
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (loading) {
    return (
      <SafeAreaView style={profileStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={uiStyles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Animated.View
        style={[
          uiStyles.screen,
          {
            opacity: screenFade,
            transform: [{ translateY: screenSlide }],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          <LinearGradient
            colors={[THEME.headerStart, THEME.headerMid, THEME.headerEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={uiStyles.headerGradient}
          >
            <View style={uiStyles.headerRow}>
              <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={uiStyles.headerTitle}>My Profile</Text>

              <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                <Ionicons
                  name={isEditing ? 'close' : 'create-outline'}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={uiStyles.avatarBlock}>
            <Animated.View style={{ transform: [{ scale: avatarTap }] }}>
              <TouchableOpacity onPress={isEditing ? handleImagePick : undefined}>
                <View style={uiStyles.avatarRing}>
                  <View style={uiStyles.avatar}>
                    {editedData.profileImage ? (
                      <Image
                        source={{ uri: editedData.profileImage }}
                        style={uiStyles.avatarImage}
                      />
                    ) : (
                      <Text style={uiStyles.avatarInitial}>
                        {profileData.first?.charAt(0).toUpperCase() || 'U'}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <Text style={uiStyles.profileName}>
              {profileData.first} {profileData.last}
            </Text>

            <Text style={uiStyles.profileEmail}>
              {profileData.email}
            </Text>
          </View>

          <View style={uiStyles.detailsCard}>

          {[
            { label: 'First Name', key: 'first', icon: 'person' },
            { label: 'Middle Name', key: 'middle', icon: 'person-outline' },
            { label: 'Last Name', key: 'last', icon: 'person' },
            { label: 'Email', key: 'email', icon: 'mail' },
            { label: 'Phone', key: 'phone', icon: 'call' }
          ].map((item, index) => {
            const hasError = isEditing && !!errors[item.key];
            return (
              <Animated.View
                key={index}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: index !== 4 ? 0.5 : 0,
                  borderColor: '#E5E7EB',
                  opacity: isEditing ? editAnim : 1,
                  transform: [{
                    translateX: isEditing
                      ? editAnim.interpolate({ inputRange: [0, 1], outputRange: [10 + index * 2, 0] })
                      : 0,
                  }],
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name={hasError ? 'alert-circle' : item.icon}
                    size={18}
                    color={hasError ? '#EF4444' : THEME.accent}
                    style={{ marginRight: 15 }}
                  />

                  <View style={{
                    flex: 1,
                    borderWidth: hasError ? 1 : 0,
                    borderColor: hasError ? '#EF4444' : 'transparent',
                    borderRadius: 8,
                    paddingHorizontal: hasError ? 8 : 0,
                    paddingVertical: hasError ? 4 : 0,
                  }}>
                    <Text style={{ fontSize: 12, color: hasError ? '#EF4444' : THEME.muted }}>
                      {item.label}
                    </Text>

                    {isEditing && item.key !== 'phone' ? (
                      <TextInput
                        style={{
                          fontSize: 15,
                          fontWeight: '500',
                          marginTop: 3,
                          color: hasError ? '#EF4444' : THEME.text,
                        }}
                        value={editedData[item.key]}
                        onChangeText={(value) => handleEditChange(item.key, value)}
                        placeholderTextColor={hasError ? '#FCA5A5' : '#9CA3AF'}
                      />
                    ) : (
                      <Text style={uiStyles.valueText}>
                        {profileData[item.key]}
                      </Text>
                    )}
                  </View>
                </View>

                {hasError && (
                  <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 33 }}>
                    {errors[item.key]}
                  </Text>
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* 🔥 Action Buttons */}
        {isEditing && (
          <View style={uiStyles.editActions}>
            <Animated.View style={{ flex: 1, marginRight: 10, transform: [{ scale: cancelTap }] }}>
              <TouchableOpacity
                style={uiStyles.cancelBtn}
                onPress={handleCancel}
                onPressIn={() => animatePressIn(cancelTap)}
                onPressOut={() => animatePressOut(cancelTap)}
              >
                <Text style={uiStyles.cancelBtnText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ flex: 1, transform: [{ scale: saveTap }] }}>
              <TouchableOpacity
                style={uiStyles.saveBtn}
                onPress={handleSave}
                onPressIn={() => animatePressIn(saveTap)}
                onPressOut={() => animatePressOut(saveTap)}
              >
                <Text style={uiStyles.saveBtnText}>
                  Save
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {/* 🔥 Logout */}
        <Animated.View style={{ marginHorizontal: 40, marginTop: 35, transform: [{ scale: logoutTap }] }}>
          <TouchableOpacity
            style={uiStyles.logoutBtn}
            onPress={handleLogout}
            onPressIn={() => animatePressIn(logoutTap)}
            onPressOut={() => animatePressOut(logoutTap)}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={uiStyles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </Animated.View>


        <View style={{ height: 30 }} />
      </ScrollView>
      </Animated.View>

      <Footer
        activeTab="profile"
        navigation={navigation}
        fromScreen={fromScreen || null}
      />

      {/* ── Image Confirm Modal ── */}
      <Modal visible={!!pendingImage} transparent animationType="fade">
        <View style={imgStyles.overlay}>
          <View style={imgStyles.card}>
            <Text style={imgStyles.title}>Use this photo?</Text>
            {pendingImage && (
              <Image source={{ uri: pendingImage }} style={imgStyles.preview} />
            )}
            <View style={imgStyles.row}>
              <TouchableOpacity
                style={imgStyles.cancelBtn}
                onPress={() => setPendingImage(null)}
              >
                <Text style={imgStyles.cancelText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={imgStyles.doneBtn}
                onPress={() => {
                  setEditedData({ ...editedData, profileImage: pendingImage });
                  setPendingImage(null);
                }}
              >
                <Text style={imgStyles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const imgStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  preview: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 24,
    resizeMode: 'cover',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: THEME.accent,
    alignItems: 'center',
  },
  cancelText: {
    color: THEME.accent,
    fontWeight: '600',
    fontSize: 15,
  },
  doneBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: THEME.accent,
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

const uiStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  screen: {
    flex: 1,
  },
  headerGradient: {
    height: 190,
    paddingTop: 6,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: FS.h2,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  avatarBlock: {
    alignItems: 'center',
    marginTop: -58,
  },
  avatarRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#111827',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: THEME.accent,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: FS.h2,
    fontWeight: '700',
    color: THEME.text,
    marginTop: 14,
  },
  profileEmail: {
    color: THEME.muted,
    marginTop: 4,
    fontSize: FS.md,
  },
  detailsCard: {
    backgroundColor: THEME.card,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#111827',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  valueText: {
    fontSize: FS.lg,
    fontWeight: '500',
    marginTop: 3,
    color: THEME.text,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  cancelBtn: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.primary,
    alignItems: 'center',
    backgroundColor: THEME.card,
  },
  cancelBtnText: {
    color: THEME.primary,
    fontWeight: '600',
  },
  saveBtn: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    alignItems: 'center',
  },
  saveBtnText: {
    color: THEME.card,
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FS.lg,
  },
});
