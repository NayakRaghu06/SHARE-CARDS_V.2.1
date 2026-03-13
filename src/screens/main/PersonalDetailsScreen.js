import React, { useState, useEffect, useRef } from 'react';
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

import { layoutStyles } from '../../styles/screens/personalDetailsLayoutStyles';
import { formStyles } from '../../styles/screens/personalDetailsFormStyles';
import AppHeader from '../../components/common/AppHeader';
import AnimatedFormItem from '../../components/common/AnimatedFormItem';
import AnimatedPressable from '../../components/common/AnimatedPressable';
// import { getUser, saveDashboard } from '../../utils/storage';
import Footer from '../../components/common/Footer';
import { saveOrUpdateUser, getUser } from '../../database/userQueries';// Validation rules
import AsyncStorage from '@react-native-async-storage/async-storage';
const validations = {
  name: {
    minLength: 2,
    lettersOnly: true,
    maxLength: 50,
    required: true,
    message: 'Name must contain only letters and spaces',
  },
  phone: {
    exactLength: 10,
    numbersOnly: true,
    startsWith: ['6', '7', '8', '9'],
    required: true,
    message: 'Enter a valid 10-digit phone number',
  },
  email: {
    required: false,
    emailFormat: true,
    message: 'Enter a valid email address',
  },
  designation: {
    required: true,
    maxLength: 40,
    message: 'Designation cannot exceed 40 characters',
  },
  address: {
    required: true,
    minLength: 5,
    message: 'Address must be at least 5 characters',
  },
};

// Validation helper functions
const validate = {
  name: (value) => {
    if (!value.trim()) return false;
    return /^[a-zA-Z\s]{2,}$/.test(value.trim());
  },
  phone: (value) => {
    return /^[0-9]{10}$/.test(value.replace(/\D/g, ''));
  },
  email: (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
};

export default function PersonalDetailsScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    phone: '',
    email: '',
    address: '',
  });

  const [userInitial, setUserInitial] = useState('N');

  //  useEffect(() => {
  //     let mounted = true;
  //     const loadUser = async () => {
  //       try {
  //         const user = await getUser();
  //         if (mounted && user) {
  //           const name = user.first || user.fullName || user.firstName || '';
  //           const initial = name && name.trim().length ? name.trim().charAt(0).toUpperCase() : 'N';
  //           setUserInitial(initial);
  //         }
  //       } catch (e) {
  //         // ignore
  //       }
  //     };
  //     loadUser();
  //     return () => {
  //       mounted = false;
  //     };
  //   }, []); 


  const [errors, setErrors] = useState({});
  const [phoneLocked, setPhoneLocked] = useState(true);
  const underlineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadPhone = async () => {
      try {
        const phone = await AsyncStorage.getItem('userPhone');
        if (phone) {
          setFormData((prev) => ({ ...prev, phone }));
        }
      } catch (e) {
        // ignore
      }
    };
    loadPhone();
  }, []);

  useEffect(() => {
    Animated.timing(underlineAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [underlineAnim]);

  // Validate single field
  const validateField = (name, value) => {
    const rule = validations[name];
    if (!rule) return '';
    const trimmed = String(value || '').trim();

    if (rule.required && !trimmed) {
      if (name === 'name') return 'Name is required';
      if (name === 'designation') return 'Designation is required';
      if (name === 'phone') return 'Enter a valid 10-digit phone number';
      if (name === 'address') return 'Address must be at least 5 characters';
      return `${name} is required`;
    }
    if (!rule.required && !trimmed) {
      return '';
    }

    if (name === 'name') {
      if (trimmed.length < rule.minLength) {
        return 'Name must be at least 2 characters';
      }
      if (trimmed.length > rule.maxLength) {
        return 'Name cannot exceed 50 characters';
      }
      if (!/^[A-Za-z\s]+$/.test(trimmed)) {
        return 'Name must contain only letters and spaces';
      }
    }

    if (name === 'phone') {
      const digits = String(value || '').replace(/\D/g, '');
      if (!/^\d{10}$/.test(digits)) {
        return 'Enter a valid 10-digit phone number';
      }
      if (!/^[6789]/.test(digits)) {
        return 'Enter a valid 10-digit phone number';
      }
    }

    if (name === 'email') {
      if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return 'Enter a valid email address';
      }
    }

    if (name === 'designation') {
      if (String(value || '').length > rule.maxLength) {
        return 'Designation cannot exceed 40 characters';
      }
    }

    if (name === 'address') {
      if (trimmed.length < rule.minLength) {
        return 'Address must be at least 5 characters';
      }
    }

    return '';
  };

  // Handle field change
  const handleFieldChange = (name, value) => {
    let cleanedValue = value;
    if (name === 'name') {
      cleanedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
    } else if (name === 'phone') {
      cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'designation') {
      cleanedValue = value.slice(0, 40);
    }
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    const error = validateField(name, cleanedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Validate all fields before saving
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
      Alert.alert('Success', 'Form data validated successfully');
      console.log('Form Data:', formData);
    } else {
      Alert.alert('Validation Error', 'Please fix all errors before proceeding');
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToBusinessDetails = () => {
    const personalData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      designation: formData.designation,
      address: formData.address,
    };
    navigation.navigate('BusinessDetails', { personalData });
  };

  const navigateToLanding = () => {
    navigation.navigate('Landing');
  };

  return (
    <SafeAreaView style={layoutStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        scrollEventThrottle={16}
      >

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

          {/* Profile Information Header */}
          <View style={layoutStyles.cardHeader}>
            <Text style={layoutStyles.cardTitle}>Step 1 of 3</Text>
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

          {/* Personal Details Section */}
          <View style={layoutStyles.detailsSection}>
            <Text style={layoutStyles.sectionTitle}>Personal Details</Text>

            {/* Name */}
            <AnimatedFormItem index={0}>
              <InputField
                label="Name *"
                placeholder="Enter your name"
                icon="person"
                value={formData.name}
                onChangeText={(text) => handleFieldChange('name', text)}
                error={errors.name}
              />
            </AnimatedFormItem>

            {/* Designation */}
            <AnimatedFormItem index={1}>
              <InputField
                label="Designation (max 40 chars) *"
                required={true}
                placeholder="Enter designation"
                icon="briefcase"
                value={formData.designation}
                onChangeText={(text) => handleFieldChange('designation', text)}
                error={errors.designation}
              />
            </AnimatedFormItem>

            {/* Phone Number */}
            <AnimatedFormItem index={2}>
              <InputField
                label="Phone Number * (10 digits)"
                placeholder="10-digit phone number"
                icon="call"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => handleFieldChange('phone', text)}
                editable={false}
                error={errors.phone}
                maxLength={10}
              />
            </AnimatedFormItem>

            {/* Email */}
            {/* <AnimatedFormItem index={3}>
              <InputField
                label="Email (optional)"
                placeholder="your.email@gmail.com"
                icon="mail"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleFieldChange('email', text)}
                error={errors.email}
              />
            </AnimatedFormItem> */}

            {/* Address */}
            <AnimatedFormItem index={4}>
              <InputField
                label="Address *"
                placeholder="Enter address"
                icon="location"
                multiline
                value={formData.address}
                onChangeText={(text) => handleFieldChange('address', text)}
                error={errors.address}
              />
            </AnimatedFormItem>
          </View>

          {/* Save Button */}
          <AnimatedPressable
            style={layoutStyles.saveButton}
            onPress={async () => {
              if (validateAllFields()) {
                saveOrUpdateUser(formData);

                // 🔥 SEE STORED DATA IN TERMINAL
                const stored = require('../../database/userQueries').getUser();
                console.log("📦 Stored Data:", stored);

                navigateToBusinessDetails();
              } else {
                Alert.alert('Validation Error', 'Please fix all errors before proceeding');
              }
            }}
          >
            <Ionicons name="checkmark-done" size={18} color="#0F0F0F" />
            <Text style={layoutStyles.saveButtonText}>Step 2: Business Details</Text>
          </AnimatedPressable>

          {/* Preview Templates removed from this step (moved to Final Preview) */}

          {/* Next Step Button */}
          <AnimatedPressable
            style={layoutStyles.skipButton}
            onPress={navigateToLanding}
          >
            <Ionicons name="arrow-back" size={18} color="#D4AF37" />
            <Text style={layoutStyles.skipButtonText}>Go Back</Text>
          </AnimatedPressable>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
      {/* <Footer activeTab="" navigation={navigation} fromScreen="PersonalDetails" /> */}
    </SafeAreaView>
  );
}

function InputField({
  label,
  placeholder,
  icon,
  multiline,
  keyboardType,
  value,
  onChangeText,
  maxLength,
  error,
  editable = true
}) {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;

  const onFocusField = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onBlurField = () => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderLabel = () => {
    if (!label) return null;

    const parts = label.split('*');

    if (parts.length === 1) {
      // No asterisk
      return <Text style={formStyles.label}>{label}</Text>;
    }

    return (
      <Text style={formStyles.label}>
        {parts[0]}
        <Text style={{ color: '#EF4444', fontWeight: '700' }}>*</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View style={formStyles.inputWrapper}>
      {renderLabel()}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={[
          formStyles.inputContainer,
          value?.trim?.() ? formStyles.inputContainerFilled : null,
          multiline && formStyles.addressInputContainer,
          isFocused && formStyles.inputFocused,
          error && { borderColor: '#EF4444', borderWidth: 1.5 }
        ]}>
          <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
            <Ionicons
              name={icon}
              size={20}
              color={error ? '#EF4444' : isFocused ? '#D4AF37' : '#9CA3AF'}
              style={[formStyles.inputIcon, multiline && formStyles.addressIcon]}
            />
          </Animated.View>
        <TextInput
          style={[
            formStyles.input,
            multiline && formStyles.addressInput,
            error && { color: '#EF4444' }
          ]}
          placeholder={placeholder}
          placeholderTextColor={error ? '#FCA5A5' : '#A0AEC0'}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          onFocus={onFocusField}
          onBlur={onBlurField}
        />
        </View>
      </Animated.View>
      {error && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontSize: 12, marginLeft: 4, fontWeight: '500' }}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
