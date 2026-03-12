import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
// import Footer from '../../components/common/Footer';
import { businessDetailsStyles } from '../../styles/screens/businessDetailsStyles';
import { layoutStyles } from '../../styles/screens/personalDetailsLayoutStyles';
// import { getUser } from '../../utils/storage';
import AppHeader from '../../components/common/AppHeader';
import AnimatedFormItem from '../../components/common/AnimatedFormItem';
import AnimatedPressable from '../../components/common/AnimatedPressable';

import { getUser, updateBusinessDetails } from '../../database/userQueries';

export default function BusinessDetailsScreen({ route, navigation }) {
  const { personalData = {} } = route.params || {};
  const [userInitial, setUserInitial] = useState('N');

  // useEffect(() => {
  //   let mounted = true;
  //   const loadUser = async () => {
  //     try {
  //       const user = await getUser();
  //       if (mounted && user) {
  //         const name = user.first || user.fullName || user.firstName || '';
  //         const initial = name && name.trim().length ? name.trim().charAt(0).toUpperCase() : 'N';
  //         setUserInitial(initial);
  //       }
  //     } catch (e) {
  //       // ignore
  //     }
  //   };
  //   loadUser();
  //   return () => {
  //     mounted = false;
  //   };
  // }, []);
  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      try {
        const user = await getUser();
        if (mounted && user) {
          const name = user.name || '';
          const initial =
            name.trim().length > 0
              ? name.trim().charAt(0).toUpperCase()
              : 'N';
          setUserInitial(initial);
        }
      } catch (e) {
        // ignore
      }
    };
    loadUser();
    return () => {
      mounted = false;
    };
  }, []);


  const [form, setForm] = useState({
    searchKeywords: '',
    companyName: '',
    businessCategory: '',
    businessSubCategory: '',
    clients: '',
    businessDescription: '',
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [pendingLogo, setPendingLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const fieldAnimsRef = useRef({});

  const getFieldAnim = (key) => {
    if (!fieldAnimsRef.current[key]) {
      fieldAnimsRef.current[key] = {
        scale: new Animated.Value(1),
        icon: new Animated.Value(1),
      };
    }
    return fieldAnimsRef.current[key];
  };

  const handleFocusAnim = (key) => {
    setFocusedField(key);
    const anim = getFieldAnim(key);
    Animated.parallel([
      Animated.timing(anim.scale, { toValue: 1.02, duration: 150, useNativeDriver: true }),
      Animated.timing(anim.icon, { toValue: 1.1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const handleBlurAnim = (key) => {
    setFocusedField((prev) => (prev === key ? '' : prev));
    const anim = getFieldAnim(key);
    Animated.parallel([
      Animated.timing(anim.scale, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(anim.icon, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    Animated.timing(underlineAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [underlineAnim]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  };

  const validatePdfFile = (file) => {
    if (!file) return '';
    const name = String(file?.name || '').toLowerCase();
    const uri = String(file?.uri || '').toLowerCase();
    const isPdf = name.endsWith('.pdf') || uri.endsWith('.pdf');
    if (!isPdf) return 'Only PDF files are allowed';
    const size = Number(file?.size || 0);
    const maxBytes = 5 * 1024 * 1024;
    if (size > maxBytes) return 'PDF file size must be 5MB or less';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    const companyName = String(form.companyName || '').trim();
    const businessCategory = String(form.businessCategory || '').trim();
    const businessSubCategory = String(form.businessSubCategory || '').trim();
    const businessDescription = String(form.businessDescription || '').trim();
    const companyNameAllowed = /^[A-Za-z0-9 .&'-]+$/;

    if (companyName) {
      if (companyName.length < 2) {
        newErrors.companyName = 'Company name must be at least 2 characters';
      } else if (!companyNameAllowed.test(companyName)) {
        newErrors.companyName = "Company name contains invalid characters";
      }
    }

    if (businessCategory && businessCategory.length < 2) {
      newErrors.businessCategory = 'Business category must be at least 2 characters';
    }

    if (businessSubCategory && businessSubCategory.length < 2) {
      newErrors.businessSubCategory = 'Business sub-category must be at least 2 characters';
    }

    if (!businessDescription) {
      newErrors.businessDescription = 'Business description is required';
    } else if (businessDescription.length < 10) {
      newErrors.businessDescription = 'Business description must be at least 10 characters';
    } else if (businessDescription.length > 500) {
      newErrors.businessDescription = 'Business description cannot exceed 500 characters';
    }

    const pdfError = validatePdfFile(pdfFile);
    if (pdfError) {
      newErrors.pdfFile = pdfError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePdfPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        const pickedPdf = {
          name: result.assets[0].name,
          uri: result.assets[0].uri,
          size: result.assets[0].size,
        };
        const pdfError = validatePdfFile(pickedPdf);
        if (pdfError) {
          setPdfFile(null);
          setErrors((prev) => ({ ...prev, pdfFile: pdfError }));
          return;
        }
        setPdfFile(pickedPdf);
        setErrors((prev) => ({ ...prev, pdfFile: '' }));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick PDF file');
    }
  };

  const handleLogoUpload = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Required', 'Please allow gallery access to upload a company logo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setPendingLogo(result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // const handleNext = () => {
  //   if (!validateForm()) {
  //     Alert.alert('Validation Error', 'Please fill all required fields');
  //     return;
  //   }

  //   const businessData = {
  //     keywords: form.searchKeywords,
  //     company: form.companyName,
  //     category: form.businessCategory,
  //     subCategory: form.businessSubCategory,
  //     clients: form.clients,
  //     description: form.businessDescription,
  //     descriptionPdf: pdfFile,
  //     logoImage: logoImage,
  //   };

  //   const cardData = {
  //     ...personalData,
  //     ...businessData,
  //   };

  //   navigation.navigate('SocialMedia', { cardData });
  // };

  const handleNext = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const businessData = {
      searchKeywords: form.searchKeywords,
      companyName: form.companyName,
      businessCategory: form.businessCategory,
      businessSubCategory: form.businessSubCategory,
      clients: form.clients,
      businessDescription: form.businessDescription,
      descriptionPdf: pdfFile,
      logoImage: logoImage,
    };

    try {
      // 🔥 SAVE BUSINESS DATA IN SQLITE
      updateBusinessDetails(businessData);

      // 🔥 PRINT FULL STORED USER IN TERMINAL
      const storedUser = getUser();
      console.log("📦 FULL USER AFTER BUSINESS SAVE:");
      console.log(JSON.stringify(storedUser, null, 2));

      navigation.navigate('SocialMedia', { cardData: { ...personalData, ...businessData } });

    } catch (error) {
      console.log("SQLite Error:", error);
      Alert.alert("Error", "Failed to save business details");
    }
  };
  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToLanding = () => {
    navigation.navigate('Landing');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={businessDetailsStyles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppHeader />
      <KeyboardAvoidingView
        style={businessDetailsStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={businessDetailsStyles.scrollContent}
          showsVerticalScrollIndicator={false}
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

            {/* Business Details Header */}
            <View style={layoutStyles.cardHeader}>
              <Text style={layoutStyles.cardTitle}>Step 2 of 3</Text>
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

            {/* Business Details Section */}
            <View style={layoutStyles.detailsSection}>
              {/* SEARCH KEYWORDS (commented for now)
              <AnimatedFormItem index={0}>
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Text style={businessDetailsStyles.label}>
                      Search Keywords
                      <Text style={businessDetailsStyles.star}> *</Text>
                    </Text>
                  </View>
                  {errors.searchKeywords && (
                    <Text style={businessDetailsStyles.errorText}>
                      {errors.searchKeywords}
                    </Text>
                  )}
                </View>
                <Animated.View style={{ transform: [{ scale: getFieldAnim('searchKeywords').scale }] }}>
                  <View style={[
                    businessDetailsStyles.input,
                    businessDetailsStyles.inputRow,
                    !!form.searchKeywords?.trim() && businessDetailsStyles.inputFilled,
                    focusedField === 'searchKeywords' && businessDetailsStyles.inputFocused,
                    errors.searchKeywords && businessDetailsStyles.inputError,
                  ]}>
                    <Animated.View style={{ transform: [{ scale: getFieldAnim('searchKeywords').icon }] }}>
                      <Ionicons
                        name="search"
                        size={17}
                        color={'#D4AF37'}
                        style={businessDetailsStyles.inputIcon}
                      />
                    </Animated.View>
                    <TextInput
                      style={businessDetailsStyles.inputField}
                      placeholder="e.g., Web Design, Digital Marketing"
                      placeholderTextColor="#9CA3AF"
                      value={form.searchKeywords}
                      onChangeText={(value) =>
                        updateForm('searchKeywords', value)
                      }
                      onFocus={() => handleFocusAnim('searchKeywords')}
                      onBlur={() => handleBlurAnim('searchKeywords')}
                    />
                  </View>
                </Animated.View>
              </View>
              </AnimatedFormItem>
              */}

              {/* COMPANY NAME */}
              <AnimatedFormItem index={1}>
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Text style={businessDetailsStyles.label}>
                      Company Name
                      <Text style={businessDetailsStyles.optionalLabel}> (optional)</Text>
                    </Text>
                  </View>
                  {errors.companyName && (
                    <Text style={businessDetailsStyles.errorText}>
                      {errors.companyName}
                    </Text>
                  )}
                </View>
                <Animated.View style={{ transform: [{ scale: getFieldAnim('companyName').scale }] }}>
                  <View style={[
                    businessDetailsStyles.input,
                    businessDetailsStyles.inputRow,
                    !!form.companyName?.trim() && businessDetailsStyles.inputFilled,
                    focusedField === 'companyName' && businessDetailsStyles.inputFocused,
                    errors.companyName && businessDetailsStyles.inputError,
                  ]}>
                    <Animated.View style={{ transform: [{ scale: getFieldAnim('companyName').icon }] }}>
                      <Ionicons
                        name="briefcase"
                        size={17}
                        color={'#D4AF37'}
                        style={businessDetailsStyles.inputIcon}
                      />
                    </Animated.View>
                    <TextInput
                      style={businessDetailsStyles.inputField}
                      placeholder="Enter your company name"
                      placeholderTextColor="#9CA3AF"
                      value={form.companyName}
                      onChangeText={(value) => updateForm('companyName', value)}
                      onFocus={() => handleFocusAnim('companyName')}
                      onBlur={() => handleBlurAnim('companyName')}
                    />
                  </View>
                </Animated.View>
              </View>
              </AnimatedFormItem>

              {/* BUSINESS CATEGORY */}
              <AnimatedFormItem index={2}>
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Text style={businessDetailsStyles.label}>
                      Business Category
                    </Text>
                  </View>
                  {errors.businessCategory && (
                    <Text style={businessDetailsStyles.errorText}>
                      {errors.businessCategory}
                    </Text>
                  )}
                </View>
                <Animated.View style={{ transform: [{ scale: getFieldAnim('businessCategory').scale }] }}>
                <View style={[
                  businessDetailsStyles.input,
                  businessDetailsStyles.inputRow,
                  !!form.businessCategory?.trim() && businessDetailsStyles.inputFilled,
                  focusedField === 'businessCategory' && businessDetailsStyles.inputFocused,
                  errors.businessCategory && businessDetailsStyles.inputError,
                ]}>
                  <Animated.View style={{ transform: [{ scale: getFieldAnim('businessCategory').icon }] }}>
                    <Ionicons
                      name="pricetag"
                      size={17}
                      color={'#D4AF37'}
                      style={businessDetailsStyles.inputIcon}
                    />
                  </Animated.View>
                  <TextInput
                    style={businessDetailsStyles.inputField}
                    placeholder="e.g., Technology, Finance"
                    placeholderTextColor="#9CA3AF"
                    value={form.businessCategory}
                    onChangeText={(value) =>
                      updateForm('businessCategory', value)
                    }
                    onFocus={() => handleFocusAnim('businessCategory')}
                    onBlur={() => handleBlurAnim('businessCategory')}
                  />
                </View>
                </Animated.View>
              </View>
              </AnimatedFormItem>

              {/* BUSINESS SUB-CATEGORY */}
              <AnimatedFormItem index={3}>
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Text style={businessDetailsStyles.label}>
                      Business Sub-Category
                    </Text>
                  </View>
                  {errors.businessSubCategory && (
                    <Text style={businessDetailsStyles.errorText}>
                      {errors.businessSubCategory}
                    </Text>
                  )}
                </View>
                <Animated.View style={{ transform: [{ scale: getFieldAnim('businessSubCategory').scale }] }}>
                <View style={[
                  businessDetailsStyles.input,
                  businessDetailsStyles.inputRow,
                  !!form.businessSubCategory?.trim() && businessDetailsStyles.inputFilled,
                  focusedField === 'businessSubCategory' && businessDetailsStyles.inputFocused,
                  errors.businessSubCategory && businessDetailsStyles.inputError,
                ]}>
                  <Animated.View style={{ transform: [{ scale: getFieldAnim('businessSubCategory').icon }] }}>
                    <Ionicons
                      name="layers"
                      size={17}
                      color={'#D4AF37'}
                      style={businessDetailsStyles.inputIcon}
                    />
                  </Animated.View>
                  <TextInput
                    style={businessDetailsStyles.inputField}
                    placeholder="e.g., Web Development, Consulting"
                    placeholderTextColor="#9CA3AF"
                    value={form.businessSubCategory}
                    onChangeText={(value) =>
                      updateForm('businessSubCategory', value)
                    }
                    onFocus={() => handleFocusAnim('businessSubCategory')}
                    onBlur={() => handleBlurAnim('businessSubCategory')}
                  />
                </View>
                </Animated.View>
              </View>
              </AnimatedFormItem>

              {/* CLIENTS (commented for now)
              <AnimatedFormItem index={4}>
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Text style={businessDetailsStyles.label}>
                      Clients
                    </Text>
                  </View>
                </View>
                <Animated.View style={{ transform: [{ scale: getFieldAnim('clients').scale }] }}>
                <View style={[
                  businessDetailsStyles.input,
                  businessDetailsStyles.inputRow,
                  !!form.clients?.trim() && businessDetailsStyles.inputFilled,
                  focusedField === 'clients' && businessDetailsStyles.inputFocused,
                ]}>
                  <Animated.View style={{ transform: [{ scale: getFieldAnim('clients').icon }] }}>
                    <Ionicons
                      name="people"
                      size={17}
                      color={'#D4AF37'}
                      style={businessDetailsStyles.inputIcon}
                    />
                  </Animated.View>
                  <TextInput
                    style={businessDetailsStyles.inputField}
                    placeholder="List your main clients (optional)"
                    placeholderTextColor="#9CA3AF"
                    value={form.clients}
                    onChangeText={(value) => updateForm('clients', value)}
                    onFocus={() => handleFocusAnim('clients')}
                    onBlur={() => handleBlurAnim('clients')}
                  />
                </View>
                </Animated.View>
              </View>
              </AnimatedFormItem>
              */}

              {/* BUSINESS DESCRIPTION */}
              <AnimatedFormItem index={5}>
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Text style={businessDetailsStyles.label}>
                      Business Description
                      <Text style={businessDetailsStyles.star}> *</Text>
                    </Text>
                  </View>
                  {errors.businessDescription && (
                    <Text style={businessDetailsStyles.errorText}>
                      {errors.businessDescription}
                    </Text>
                  )}
                </View>
                <Animated.View style={{ transform: [{ scale: getFieldAnim('businessDescription').scale }] }}>
                  <View style={[
                    businessDetailsStyles.input,
                    businessDetailsStyles.inputRow,
                    !!form.businessDescription?.trim() && businessDetailsStyles.inputFilled,
                    focusedField === 'businessDescription' && businessDetailsStyles.inputFocused,
                    businessDetailsStyles.multilineInput,
                    errors.businessDescription &&
                    businessDetailsStyles.inputError,
                  ]}>
                    <Animated.View style={{ transform: [{ scale: getFieldAnim('businessDescription').icon }] }}>
                      <Ionicons
                        name="document-text"
                        size={17}
                        color={'#D4AF37'}
                        style={[businessDetailsStyles.inputIcon, businessDetailsStyles.inputIconMultiline]}
                      />
                    </Animated.View>
                    <TextInput
                      style={[businessDetailsStyles.inputField, businessDetailsStyles.multilineInput]}
                      placeholder="Describe your business, services, and expertise"
                      placeholderTextColor="#9CA3AF"
                      value={form.businessDescription}
                      maxLength={500}
                      onChangeText={(value) =>
                        updateForm('businessDescription', value)
                      }
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                      onFocus={() => handleFocusAnim('businessDescription')}
                      onBlur={() => handleBlurAnim('businessDescription')}
                    />
                  </View>
                </Animated.View>
              </View>
              </AnimatedFormItem>

              {/* PDF UPLOAD */}
              <AnimatedFormItem index={6}>
              <View style={businessDetailsStyles.fieldWrapper}>
                <View style={businessDetailsStyles.labelRow}>
                  <View style={businessDetailsStyles.labelLeft}>
                    <Ionicons
                      name="document"
                      size={17}
                      color="#D4AF37"
                    />
                    <Text style={businessDetailsStyles.label}>
                      {'  '}Business Description PDF
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={businessDetailsStyles.pdfButton}
                  onPress={handlePdfPicker}
                >
                  <Ionicons
                    name="cloud-upload"
                    size={20}
                    color="#D4AF37"
                  />
                  <Text style={businessDetailsStyles.pdfButtonText}>
                    Choose PDF File
                  </Text>
                </TouchableOpacity>
                {pdfFile && (
                  <View style={businessDetailsStyles.pdfFileInfo}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#22c55e"
                    />
                    <Text style={businessDetailsStyles.pdfFileName}>
                      {pdfFile.name}
                    </Text>
                  </View>
                )}
                {errors.pdfFile ? (
                  <Text style={businessDetailsStyles.errorText}>{errors.pdfFile}</Text>
                ) : null}
              </View>
              </AnimatedFormItem>

            </View>

            {/* BUTTON GROUP */}
            <View style={layoutStyles.buttonGroup}>
              <AnimatedPressable
                style={layoutStyles.saveButton}
                onPress={handleNext}
              >
                <Ionicons name="checkmark-done" size={18} color="#0F0F0F" />
                <Text style={layoutStyles.saveButtonText}>Step 3: Social Media</Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={layoutStyles.skipButton}
                onPress={handleBack}
              >
                <Ionicons name="arrow-back" size={18} color="#D4AF37" />
                <Text style={layoutStyles.skipButtonText}>Go Back</Text>
              </AnimatedPressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* <Footer activeTab="" navigation={navigation} fromScreen="BusinessDetails" /> */}

      {/* ── Logo Confirm Modal ── */}
      <Modal visible={!!pendingLogo} transparent animationType="fade">
        <View style={logoStyles.overlay}>
          <View style={logoStyles.card}>
            <Text style={logoStyles.title}>Use this logo?</Text>
            {pendingLogo && (
              <Image source={{ uri: pendingLogo.uri }} style={logoStyles.preview} />
            )}
            <View style={logoStyles.row}>
              <TouchableOpacity
                style={logoStyles.cancelBtn}
                onPress={() => setPendingLogo(null)}
              >
                <Text style={logoStyles.cancelText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={logoStyles.doneBtn}
                onPress={() => {
                  setLogoImage({
                    name: pendingLogo.fileName || 'logo.jpg',
                    uri: pendingLogo.uri,
                    type: pendingLogo.type,
                    width: pendingLogo.width,
                    height: pendingLogo.height,
                  });
                  setPendingLogo(null);
                }}
              >
                <Text style={logoStyles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const logoStyles = StyleSheet.create({
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
    width: 160,
    height: 160,
    borderRadius: 12,
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
    borderColor: '#C9A227',
    alignItems: 'center',
  },
  cancelText: {
    color: '#C9A227',
    fontWeight: '600',
    fontSize: 15,
  },
  doneBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#C9A227',
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
