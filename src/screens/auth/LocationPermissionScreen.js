import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { locationStyles } from '../../styles/screens/locationStyles';
import { COLORS } from '../../styles/colors';

export default function LocationPermissionScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState('while-using');
  const [permissionRequested, setPermissionRequested] = useState(false);

  const handleGrantPermission = async () => {
    try {
      setPermissionRequested(true);
      // Simulate permission request
      setTimeout(() => {
        navigation.replace('Login');
      }, 1500);
    } catch (error) {
      console.log('Error requesting permission:', error);
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={locationStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />

      {/* (Logo removed) */}

      {/* Main Content Card (centered) */}
      <View style={locationStyles.cardContainer}>
        {/* Location Icon */}
        <View style={locationStyles.iconWrapper}>
          <Ionicons name="location" size={48} color={COLORS.card} />
        </View>

        {/* Title */}
        <Text style={locationStyles.cardTitle}>
          Allow Digital Business Card to access this device's location?
        </Text>

        {/* Location Options */}
        <View style={locationStyles.optionsContainer}>
          {/* Precise Option */}
          <TouchableOpacity
            style={[
              locationStyles.optionBox,
              selectedOption === 'precise' && locationStyles.optionBoxSelected,
            ]}
            onPress={() => setSelectedOption('precise')}
          >
            <View style={locationStyles.optionMapContainer}>
              <Ionicons name="radio-button-on" size={24} color={COLORS.accent} />
              <Text style={locationStyles.mapLabel}>Precise</Text>
            </View>
          </TouchableOpacity>

          {/* Approximate Option */}
          <TouchableOpacity
            style={[
              locationStyles.optionBox,
              selectedOption === 'approximate' && locationStyles.optionBoxSelected,
            ]}
            onPress={() => setSelectedOption('approximate')}
          >
            <View style={locationStyles.optionMapContainer}>
              <Ionicons name="radio-button-on" size={24} color={COLORS.accent} />
              <Text style={locationStyles.mapLabel}>Approximate</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Permission Level Options */}
        <View style={locationStyles.permissionOptions}>
          {/* While Using App */}
          <TouchableOpacity
            style={[
              locationStyles.permissionOption,
              selectedOption === 'while-using' && locationStyles.permissionOptionSelected,
            ]}
            onPress={() => setSelectedOption('while-using')}
          >
            <View style={locationStyles.permissionOptionRow}>
              <View
                style={[
                  locationStyles.circleIndicator,
                  selectedOption === 'while-using' && locationStyles.circleIndicatorSelected,
                ]}
              />
              <Text
                style={[
                  locationStyles.permissionText,
                  selectedOption === 'while-using' && locationStyles.permissionTextSelected,
                ]}
              >
                While using the app
              </Text>
            </View>
          </TouchableOpacity>

          {/* Only This Time */}
          <TouchableOpacity
            style={[
              locationStyles.permissionOption,
              selectedOption === 'only-once' && locationStyles.permissionOptionSelected,
            ]}
            onPress={() => setSelectedOption('only-once')}
          >
            <View style={locationStyles.permissionOptionRow}>
              <View
                style={[
                  locationStyles.circleIndicator,
                  selectedOption === 'only-once' && locationStyles.circleIndicatorSelected,
                ]}
              />
              <Text
                style={[
                  locationStyles.permissionText,
                  selectedOption === 'only-once' && locationStyles.permissionTextSelected,
                ]}
              >
                Only this time
              </Text>
            </View>
          </TouchableOpacity>

          {/* Don't Allow */}
          <TouchableOpacity
            style={[
              locationStyles.permissionOption,
              selectedOption === 'dont-allow' && locationStyles.permissionOptionSelected,
              locationStyles.permissionOptionStretch,
              locationStyles.permissionOptionNoBubble,
            ]}
            onPress={() => {
              setSelectedOption('dont-allow');
              setTimeout(() => handleSkip(), 200);
            }}
          >
            <View style={locationStyles.permissionOptionCenter}>
              <Text
                style={[
                  locationStyles.denyText,
                  selectedOption === 'dont-allow' && locationStyles.permissionTextSelected,
                ]}
              >
                Don't allow
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Bottom Buttons moved inside card to keep card centered */}
        <View style={locationStyles.bottomButtonsInside}>
          <TouchableOpacity
            style={locationStyles.skipButton}
            onPress={handleSkip}
          >
            <Text style={locationStyles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={locationStyles.grantButton}
            onPress={handleGrantPermission}
            disabled={permissionRequested}
          >
            <Text style={locationStyles.grantButtonText}>
              {permissionRequested ? 'Granting...' : 'Grant Location Permission'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
