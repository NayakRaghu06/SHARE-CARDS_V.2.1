import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACTIVE_COLOR = '#D4AF37';
const INACTIVE_COLOR = '#9CA3AF';

export default function Footer({ activeTab = 'home', navigation, fromScreen = null }) {
  const handleHomePress = () => {
    navigation.navigate('Landing');
  };

  const handleContactsPress = () => {
    navigation.navigate('Contacts');
  };

  const handleProfilePress = () => {
    if (activeTab === 'profile' && fromScreen) {
      // If already on Profile, go back to previous screen
      navigation.pop();
    } else {
      // Navigate to Profile
      navigation.push('Profile', { fromScreen });
    }
  };

  return (
    <View style={styles.footerTabs}>
      <TouchableOpacity 
        style={styles.footerTab}
        onPress={handleHomePress}
      >
        {activeTab === 'home' ? <View style={styles.activeIndicator} /> : null}
        <Ionicons 
          name={activeTab === 'home' ? 'home' : 'home-outline'} 
          size={24} 
          color={activeTab === 'home' ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text style={[styles.footerTabLabel, activeTab === 'home' && styles.footerTabLabelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.footerTab}
        onPress={handleContactsPress}
      >
        {activeTab === 'contacts' ? <View style={styles.activeIndicator} /> : null}
        <Ionicons 
          name={activeTab === 'contacts' ? 'people' : 'people-outline'} 
          size={24} 
          color={activeTab === 'contacts' ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text style={[styles.footerTabLabel, activeTab === 'contacts' && styles.footerTabLabelActive]}>
          Contacts
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.footerTab}
        onPress={handleProfilePress}
      >
        {activeTab === 'profile' ? <View style={styles.activeIndicator} /> : null}
        <Ionicons 
          name={activeTab === 'profile' ? 'person' : 'person-outline'} 
          size={24} 
          color={activeTab === 'profile' ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
        <Text style={[styles.footerTabLabel, activeTab === 'profile' && styles.footerTabLabelActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    height: 65,
  },
  footerTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 8,
  },
  activeIndicator: {
    height: 3,
    width: 28,
    borderRadius: 2,
    backgroundColor: ACTIVE_COLOR,
    position: 'absolute',
    top: 0,
  },
  footerTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: INACTIVE_COLOR,
    marginTop: 4,
  },
  footerTabLabelActive: {
    color: ACTIVE_COLOR,
  },
});
