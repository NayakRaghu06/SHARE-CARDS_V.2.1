import { useEffect } from 'react';
import { View, Image, StatusBar, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../../utils/api';
import websocketService from '../../utils/websocketService';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const pairs = await AsyncStorage.multiGet(['loggedInUserId', 'sessionCookie']);
        const userId = pairs[0][1];
        const cookie = pairs[1][1];

        if (userId && cookie) {
          // Validate the stored session against the backend
          const { res } = await apiFetch('/user/profile');
          if (res.ok) {
            // Session still valid — reconnect websocket and skip Login
            try { await websocketService.connect(userId); } catch {}
            navigation.replace('Landing');
            return;
          }
          // Session expired — wipe stale data and fall through to Login
          await AsyncStorage.multiRemove([
            'isLoggedIn', 'loggedInUserId', 'userPhone', 'sessionCookie',
          ]);
        }
      } catch {}
      navigation.replace('Login');
    };

    // 1.5 s splash then check
    const timer = setTimeout(checkSession, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <Image
        source={require('../../assets/images/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
});
