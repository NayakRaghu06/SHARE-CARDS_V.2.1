import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ModernTemplate from '../../components/templates/ModernTemplate';
import DarkTemplate from '../../components/templates/DarkTemplate';
import ClassicTemplate from '../../components/templates/ClassicTemplate';
import { layoutStyles } from '../../styles/screens/personalDetailsLayoutStyles';
import AppHeader from '../../components/common/AppHeader';
import { getUser as getUserDb } from '../../database/userQueries';
import styles from '../../styles/screens/templatePreviewStyles';

const TemplatePreviewScreen = ({ route, navigation }) => {
  const routeParams = route?.params || {};
  const { cardData = {} } = routeParams;
  const [selectedTemplate, setSelectedTemplate] = useState(cardData?.selectedTemplate || null);

  React.useEffect(() => {
    // Log received cardData for debugging
    console.log('TemplatePreviewScreen received cardData:', JSON.stringify(cardData, null, 2));
  }, [cardData]);

  // If no cardData passed via navigation, try to load from DB (fallback)
  const effectiveCardData = React.useMemo(() => {
    try {
      const stored = getUserDb() || {};
      // Merge stored values with passed cardData so partial updates don't hide earlier fields
      if (cardData && Object.keys(cardData).length > 0) {
        return { ...stored, ...cardData };
      }
      return stored;
    } catch (e) {
      console.warn('Failed to load stored user for preview', e);
      return cardData || {};
    }
  }, [cardData]);

  const templates = [
    { id: 'classic', name: 'Classic', component: ClassicTemplate },
    { id: 'modern', name: 'Modern', component: ModernTemplate },
    { id: 'dark', name: 'Dark', component: DarkTemplate },
  ];

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleViewPreview = () => {
    if (selectedTemplate) {
      const finalCard = (cardData && Object.keys(cardData).length > 0) ? cardData : effectiveCardData;
      navigation.navigate('FinalPreview', { 
        cardData: finalCard, 
        template: selectedTemplate 
      });
    }
  };

  // previews show only the card templates; field debug panels removed

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <AppHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 16, paddingTop: 20 }}>
        
        {/* Title Section */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[layoutStyles.mainTitle, { fontSize: 24, marginBottom: 8 }]}>Select a Template</Text>
          <Text style={[layoutStyles.subtitle, { fontSize: 14 }]}>Choose a design for your digital business card</Text>
        </View>

        {/* Template Cards */}
        <View>
          {templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={[
                styles.templateCard,
                selectedTemplate === template.id && styles.templateCardSelected
              ]}
              onPress={() => handleSelectTemplate(template.id)}
            >
              {/* Card Preview */}
              <View style={styles.cardPreviewWrapper}>
                {(() => {
                  const TemplateComponent = template.component;
                  return <TemplateComponent userData={effectiveCardData} />;
                })()}
              </View>

              {/* Template Name and Selection */}
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <View style={[styles.radioButton, selectedTemplate === template.id && styles.radioButtonSelected]}>
                  {selectedTemplate === template.id && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* previews show only templates; debug panels removed */}

      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[styles.continueButton, !selectedTemplate && styles.continueButtonDisabled]} 
          onPress={handleViewPreview}
          disabled={!selectedTemplate}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.continueButtonText}>View Final Preview</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TemplatePreviewScreen;
