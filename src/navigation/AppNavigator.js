import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// ── Custom bottom tab bar with a small gold indicator above active tab ─────────
const TAB_ICONS = {
  Home:     { active: 'home',        inactive: 'home-outline' },
  Contacts: { active: 'people',      inactive: 'people-outline' },
  Profile:  { active: 'person',      inactive: 'person-outline' },
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      height: 60,
      elevation: 8,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: -2 },
      shadowRadius: 4,
    }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? route.name;
        const isFocused = state.index === index;
        const icons = TAB_ICONS[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            {isFocused && (
              <View style={{
                position: 'absolute',
                top: 0,
                width: 40,
                height: 3,
                backgroundColor: '#C9A227',
                borderRadius: 2,
              }} />
            )}
            <Ionicons
              name={isFocused ? icons.active : icons.inactive}
              size={24}
              color={isFocused ? '#D4AF37' : '#9CA3AF'}
            />
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: isFocused ? '#D4AF37' : '#9CA3AF',
              marginTop: 4,
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

import SplashScreen from '../screens/auth/SplashScreen';
import CardDetailsScreen from '../screens/main/CardDetailsScreen';
import LocationPermissionScreen from '../screens/auth/LocationPermissionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import SharedCardPreviewScreen from '../screens/auth/SharedCardPreviewScreen';
import LandingScreen from '../screens/main/LandingScreen';
import UserDetailsScreen from '../screens/main/UserDetailsScreen';
// ...existing code...
import InboxScreen from '../screens/main/InboxScreen';
import PersonalDetailsScreen from '../screens/main/PersonalDetailsScreen';
import BusinessDetailsScreen from '../screens/main/BusinessDetailsScreen';
import SocialMediaScreen from '../screens/main/SocialMediaScreen';
import TemplatePreviewScreen from '../screens/main/TemplatePreviewScreen';
import SelectTemplateScreen from '../screens/main/SelectTemplateScreen';
import FinalPreviewScreen from '../screens/main/FinalPreviewScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import MyCardsScreen from '../screens/main/MyCardsScreen';
import EditCardScreen from '../screens/main/EditCardScreen';
import ContactsScreen from '../screens/main/ContactsScreen';
import UploadScreen from '../screens/main/UploadScreen';
import AppShareScreen from '../screens/main/AppShareScreen';
import RecipientDetailsScreen from '../screens/main/RecipientDetailsScreen';
// onboarding screens removed

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ========== DASHBOARD TAB NAVIGATOR ==========
function DashboardTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen 
        name="Home" 
        component={PersonalDetailsScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen}
        options={{
          tabBarLabel: 'Contacts',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

// ========== MAIN STACK NAVIGATOR ==========
export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="SharedCardPreview" component={SharedCardPreviewScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Landing" component={LandingScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="Upload" component={UploadScreen} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
      <Stack.Screen name="SocialMedia" component={SocialMediaScreen} />
      <Stack.Screen name="TemplatePreview" component={TemplatePreviewScreen} />
      <Stack.Screen name="SelectTemplate" component={SelectTemplateScreen} />
      <Stack.Screen name="FinalPreview" component={FinalPreviewScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="MyCards" component={MyCardsScreen} />
      <Stack.Screen name="InboxScreen" component={InboxScreen} />
      <Stack.Screen name="EditCardScreen" component={EditCardScreen} />
      <Stack.Screen name="CardDetailsScreen" component={CardDetailsScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="ShareCardScreen" component={require('../screens/main/ShareCardScreen').default} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="AppShareScreen" component={AppShareScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="RecipientDetailsScreen" component={RecipientDetailsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Dashboard" component={DashboardTabs} options={{ animation: 'fade' }} />
    </Stack.Navigator>
  );
}
