import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colorsDefault from "../../styles/colors";
import styles from "../../styles/screens/selectTemplateStyles";
import { layoutStyles } from "../../styles/screens/personalDetailsLayoutStyles";
import Footer from '../../components/common/Footer';
import { getUser } from "../../utils/storage";
import ClassicTemplate from "../../components/templates/ClassicTemplate";
import ModernTemplate from "../../components/templates/ModernTemplate";
import DarkTemplate from "../../components/templates/DarkTemplate";

export default function SelectTemplateScreen({ route, navigation }) {
  const [selected, setSelected] = useState(null);
  const [userData, setUserData] = useState(route.params?.userData || {});
  const [cardData, setCardData] = useState(route.params?.cardData || {});
  const [userInitial, setUserInitial] = useState('N');

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      try {
        const user = await getUser();
        if (mounted && user) {
          const name = user.first || user.fullName || user.firstName || '';
          const initial = name && name.trim().length ? name.trim().charAt(0).toUpperCase() : 'N';
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

  // Load user data from storage if not provided in route
  React.useEffect(() => {
    if (!route.params?.userData || Object.keys(route.params?.userData).length === 0) {
      (async () => {
        try {
          const { getUser } = await import('../../utils/storage');
          const user = await getUser();
          if (user) {
            setUserData(user);
          }
        } catch (e) {
          console.log('Error loading user:', e);
        }
      })();
    }
  }, [route.params]);

  // If route didn't pass cardData, try loading draft from storage
  React.useEffect(() => {
    if (!route.params?.cardData) {
      (async () => {
        try {
          const { getCardDraft } = await import('../../utils/storage');
          const draft = await getCardDraft();
          if (draft && Object.keys(draft).length) setCardData(draft);
        } catch (e) {
          // ignore
        }
      })();
    }
  }, [route.params]);

  // Sample user data for display - use real data or fallback
  const defaultUserData = {
    name: userData?.name || userData?.fullName || 'Your Name',
    title: userData?.title || userData?.designation || 'Your Title',
    email: userData?.email || 'your.email@example.com',
    phone: userData?.phone || '+1 (555) 000-0000',
    company: userData?.company || userData?.organization || 'Your Company',
    website: userData?.website || 'www.yourwebsite.com',
  };

  const templates = [
    { id: 'classic', name: 'Classic', component: ClassicTemplate },
    { id: 'modern', name: 'Modern', component: ModernTemplate },
    { id: 'dark', name: 'Dark', component: DarkTemplate },
  ];

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* ========== HEADER SECTION ========== */}
      <View style={layoutStyles.headerSection}>
        {/* Back Button */}
        <TouchableOpacity 
          onPress={handleBack}
          style={{ width: 24, justifyContent: 'center', alignItems: 'center', zIndex: 2 }}
        >
          <Ionicons name="chevron-back" size={28} color="#D4AF37" />
        </TouchableOpacity>

        {/* App Title Centered */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
          <Text style={layoutStyles.appTitle}>DIGITAL BUSINESS CARD</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Choose a template</Text>
        </View>

        {/* Template Cards - One by One */}
        <View style={styles.templatesContainer}>
          {templates.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 16, color: '#999', textAlign: 'center' }}>
                No templates available
              </Text>
            </View>
          ) : (
            templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[styles.templateCard, selected === template.id && styles.templateCardSelected]}
                onPress={() => setSelected(template.id)}
              >
                {/* Card Preview */}
                <View style={styles.cardPreviewWrapper}>
                  {(() => {
                    const Comp = template.component;
                    return <Comp userData={defaultUserData} isSelected={selected === template.id} />;
                  })()}
                </View>

                {/* Template Name */}
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>{template.name}</Text>
                </View>

                {/* Selection Radio Button */}
                <View style={[styles.radioButton, selected === template.id && styles.radioButtonSelected]}>
                  {selected === template.id && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.continueButton, (!selected || templates.length === 0) && styles.continueButtonDisabled]} 
          onPress={() => selected && navigation.navigate('FinalPreview', { template: selected, userData: userData })}
          disabled={!selected || templates.length === 0}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.continueButtonText}>View Preview</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
