
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { layoutStyles } from '../../styles/screens/socialMediaStyles';
import { formStyles } from '../../styles/screens/socialMediaStyles';
import AppHeader from '../../components/common/AppHeader';
import ProfileAvatarUpload from '../../components/common/ProfileAvatarUpload';
import LogoUploadCard from '../../components/common/LogoUploadCard';
import AnimatedFormItem from '../../components/common/AnimatedFormItem';
import AnimatedPressable from '../../components/common/AnimatedPressable';
// template previews moved to TemplatePreview flow

// Validation rules
const validations = {
  whatsapp: {
    exactLength: 10,
    numbersOnly: true,
    required: false,
  },
  instagram: {
    noSpaces: true,
    required: false,
  },
  linkedin: {
    urlFormat: true,
    required: false,
  },
  twitter: {
    usernameFormat: true,
    required: false,
  },
  facebook: {
    urlFormat: true,
    required: false,
  },
  website: {
    urlFormat: true,
    required: false,
  },
};

export default function SocialMediaScreen({ route, navigation }) {
  const { cardData = {} } = route.params || {};

  const [formData, setFormData] = useState({
    whatsapp: '',
    linkedin: '',
    instagram: '',
    website: '',
    twitter: '',
    facebook: '',
    companyLogo: null,
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({});
  const underlineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadUserPhone = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('userPhone');
        const normalized = String(storedPhone || '').replace(/\D/g, '').slice(0, 10);
        if (!normalized) return;
        setFormData((prev) => ({ ...prev, whatsapp: normalized }));
      } catch (e) {
        console.warn('Failed to load user phone for WhatsApp autofill', e);
      }
    };
    loadUserPhone();
  }, []);

  // ================================
  // IMAGE PICKER FUNCTION (WORKING)
  // ================================
  const handleImagePicker = async (field) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow gallery access to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0].uri;

        setFormData((prev) => ({
          ...prev,
          [field]: selectedImage,
        }));
      }
    } catch (error) {
      console.log("Image Picker Error:", error);
      Alert.alert("Error", "Something went wrong while selecting image");
    }
  };

  const handleRemoveImage = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  // ================================
  // VALIDATION
  // ================================
  const validateField = (name, value) => {
    const rule = validations[name];
    if (rule?.required && !value?.trim()) {
      if (name === 'linkedin') return 'LinkedIn profile URL is required';
      return `${name} is required`;
    }
    if (!value?.trim()) return '';

    if (name === 'whatsapp') {
      const digits = value.replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(digits)) {
        return 'Please enter a valid 10-digit WhatsApp number';
      }
    }

    if (name === 'instagram') {
      if (/\s/.test(value)) return 'Instagram username cannot contain spaces';
    }

    if (name === 'linkedin') {
      if (!/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i.test(value.trim())) {
        return 'Enter a valid LinkedIn profile URL';
      }
    }

    if (name === 'twitter') {
      if (!/^@?(\w){1,15}$/.test(value.trim())) {
        return 'Enter a valid Twitter username';
      }
    }

    if (name === 'facebook') {
      if (!/^(https?:\/\/)?(www\.)?facebook\.com\/.*$/i.test(value.trim())) {
        return 'Enter a valid Facebook profile URL';
      }
    }

    if (name === 'website') {
      if (!/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i.test(value.trim())) {
        return 'Enter a valid website URL';
      }
    }

    return '';
  };

  const handleFieldChange = (name, value) => {
    let cleanedValue = value;

    if (name === 'whatsapp') {
      cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'instagram') {
      cleanedValue = value.replace(/\s/g, '');
    } else if (name === 'twitter') {
      cleanedValue = value.replace(/\s/g, '').slice(0, 16);
    }

    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));

    const error = validateField(name, cleanedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAllFields = () => {
    const newErrors = {};

    Object.keys(validations).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateAllFields()) {
      // Map upload field names to template/user keys so templates receive expected props
      const uploadMap = {
        // templates expect `profileImage` for avatar
        profileImage: formData.profilePhoto || cardData.profileImage || cardData.profilePhoto || null,
        // company logo
        companyLogo: formData.companyLogo || cardData.companyLogo || cardData.logoImage || null,
      };

      const socialFields = {
        whatsapp: formData.whatsapp || cardData.whatsapp || cardData.whatsappNumber || null,
        linkedin: formData.linkedin || cardData.linkedin || null,
        instagram: formData.instagram || cardData.instagram || null,
        website: formData.website || cardData.website || null,
        twitter: formData.twitter || cardData.twitter || null,
        facebook: formData.facebook || cardData.facebook || null,
      };

      const finalCardData = {
        ...cardData,
        ...uploadMap,
        ...socialFields,
      };

      // Build QR payload from merged data
      const qrPayload = {
        name: finalCardData.name || finalCardData.fullName || finalCardData.firstName || null,
        designation: finalCardData.designation || finalCardData.role || null,
        companyName: finalCardData.companyName || finalCardData.company || null,
        phone: finalCardData.phone || null,
        email: finalCardData.email || null,
        address: finalCardData.address || null,
        description: finalCardData.businessDescription || finalCardData.description || null,
        social: {
          whatsapp: finalCardData.whatsapp || null,
          linkedin: finalCardData.linkedin || null,
          instagram: finalCardData.instagram || null,
          website: finalCardData.website || null,
        },
        logo: finalCardData.companyLogo || null,
      };

      // Do not auto-generate QR. Attach merged data and navigate to template picker.
      navigation.navigate('TemplatePreview', { cardData: finalCardData });
    } else {
      Alert.alert('Validation Error', 'Please fix all errors');
    }
  };

  // Preload any existing images from incoming cardData so previews show existing photos
  React.useEffect(() => {
    if (!cardData) return;
    setFormData((prev) => {
      const next = {
        ...prev,
        companyLogo: cardData.companyLogo || cardData.logoImage || prev.companyLogo,
        profilePhoto: cardData.profileImage || cardData.profilePhoto || prev.profilePhoto,
        whatsapp: cardData.whatsapp || prev.whatsapp,
        linkedin: cardData.linkedin || prev.linkedin,
        instagram: cardData.instagram || prev.instagram,
        website: cardData.website || prev.website,
        twitter: cardData.twitter || prev.twitter,
        facebook: cardData.facebook || prev.facebook,
      };

      // Avoid updating state if nothing changed (prevents infinite loops when cardData reference changes)
      const keys = Object.keys(next);
      const isSame = keys.every((k) => next[k] === prev[k]);
      return isSame ? prev : next;
    });
  }, [cardData]);

  React.useEffect(() => {
    Animated.timing(underlineAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [underlineAnim]);

  const navigateToBusinessDetails = () => {
    navigation.goBack();
  };

  // Custom back handler for header
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={layoutStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ========== TITLE SECTION ========== */}
        <View style={layoutStyles.titleSection}>
          {/* <Text style={layoutStyles.mainTitle}>
          Digital Business Card Creator
        </Text> */}
          <Text style={layoutStyles.subtitle}>
            Create your professional digital business card in minutes
          </Text>
        </View>

        {/* ========== FORM CARD SECTION ========== */}
        <View style={layoutStyles.formCard}>

          {/* Business Details Header */}
          <View style={layoutStyles.cardHeader}>
            <Text style={layoutStyles.cardTitle}>Step 3 of 3</Text>
            <Text style={layoutStyles.cardSubtitle}>
              All fields marked with * are mandatory
            </Text>
            <Animated.View
              style={[
                layoutStyles.stepUnderline,
                {
                  width: underlineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '38%'],
                  }),
                },
              ]}
            />
          </View>

          {/* <Text style={layoutStyles.sectionTitle}>
          Social Media & Contact Links
        </Text> */}

          <AnimatedFormItem index={0}>
            <InputField
              label="WhatsApp"
              placeholder="Mobile number"
              icon="logo-whatsapp"
              keyboardType="phone-pad"
              value={formData.whatsapp}
              onChangeText={(text) => handleFieldChange('whatsapp', text.replace(/[^0-9]/g, '').slice(0, 10))}
              error={errors.whatsapp}
              maxLength={10}
              editable={false}
            />
          </AnimatedFormItem>

          <AnimatedFormItem index={1}>
            <InputField
              label="LinkedIn (Optional)"
              placeholder="https://linkedin.com/in/yourprofile"
              icon="logo-linkedin"
              value={formData.linkedin}
              onChangeText={(text) => handleFieldChange('linkedin', text)}
              error={errors.linkedin}
            />
          </AnimatedFormItem>

          <AnimatedFormItem index={2}>
            <InputField
              label="Website (Optional)"
              placeholder="Website URL"
              icon="globe-outline"
              value={formData.website}
              onChangeText={(text) => handleFieldChange('website', text)}
              error={errors.website}
              keyboardType="url"
            />
          </AnimatedFormItem>

          {/* <AnimatedFormItem index={3}>
            <InputField
              label="Twitter (Optional)"
              placeholder="@username"
              icon="logo-twitter"
              value={formData.twitter}
              onChangeText={(text) => handleFieldChange('twitter', text)}
              error={errors.twitter}
              maxLength={16}
            />
          </AnimatedFormItem> */}

          {/* <AnimatedFormItem index={4}>
            <InputField
              label="Facebook (Optional)"
              placeholder="https://facebook.com/username"
              icon="logo-facebook"
              value={formData.facebook}
              onChangeText={(text) => handleFieldChange('facebook', text)}
              error={errors.facebook}
            />
          </AnimatedFormItem> */}

          {/* <InputField
            label="Website (Optional)"
            placeholder="https://example.com"
            icon="globe"
            value={formData.website}
            onChangeText={(text) => handleFieldChange('website', text)}
            error={errors.website}
          /> */}

          {/* ================= UPLOAD SECTION ================= */}

          <Text style={layoutStyles.sectionTitle}>Media Uploads</Text>

          <AnimatedFormItem index={5}>
            <ProfileAvatarUpload
              label="Profile Photo"
              imageUri={formData.profilePhoto}
              onPress={() => handleImagePicker('profilePhoto')}
              onRemovePress={() => handleRemoveImage('profilePhoto')}
              size={110}
              centered
            />
          </AnimatedFormItem>

          <AnimatedFormItem index={6}>
            <LogoUploadCard
              label="Company Logo"
              imageUri={formData.companyLogo}
              onPress={() => handleImagePicker('companyLogo')}
              onRemovePress={() => handleRemoveImage('companyLogo')}
              height={120}
            />
          </AnimatedFormItem>

          {/* Template selection moved to TemplatePreview after Save & Submit */}

          <AnimatedPressable
            style={layoutStyles.saveButton}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-done" size={18} color="#0F0F0F" />
            <Text style={layoutStyles.saveButtonText}>
              Save & Submit
            </Text>
          </AnimatedPressable>

          {/* Go Back Button */}
          <AnimatedPressable
            style={[layoutStyles.saveButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D4AF37', marginTop: 12 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[layoutStyles.saveButtonText, { color: '#D4AF37' }]}>← Go Back</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

}

function InputField({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  keyboardType,
  maxLength,
  error,
  editable = true,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;

  const onFocusField = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 1.02, duration: 150, useNativeDriver: true }),
      Animated.timing(iconScaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const onBlurField = () => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(iconScaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={formStyles.inputWrapper}>
      <Text style={formStyles.label}>{label}</Text>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={[
          formStyles.inputContainer,
          value?.trim?.() ? formStyles.inputContainerFilled : null,
          isFocused && formStyles.inputFocused,
          error && { borderColor: '#EF4444', borderWidth: 1.5 }
        ]}>
          <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
            <Ionicons
              name={icon}
              size={20}
              color={error ? '#EF4444' : isFocused ? '#D4AF37' : '#9CA3AF'}
              style={formStyles.inputIcon}
            />
          </Animated.View>

          <TextInput
            style={formStyles.input}
            placeholder={placeholder}
            keyboardType={keyboardType || 'default'}
            maxLength={maxLength}
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="none"
            autoCorrect={false}
            editable={editable}
            onFocus={onFocusField}
            onBlur={onBlurField}
          />
        </View>
      </Animated.View>

      {error && (
        <Text style={{ color: '#EF4444', fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
