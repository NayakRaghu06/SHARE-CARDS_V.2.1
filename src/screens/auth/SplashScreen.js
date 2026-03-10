import { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { splashStyles } from '../../styles/screens/splashStyles';
import { getSession } from '../../utils/storage';

export default function SplashScreen({ navigation }) {
  // ── Animation values ──────────────────────────────────────────────────────
  const logoScale   = useRef(new Animated.Value(0.72)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY       = useRef(new Animated.Value(18)).current;

  // ── Play entrance animation once on mount ────────────────────────────────
  useEffect(() => {
    // Step 1: logo circle scales in + fades in
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 44,
        friction: 7,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();

    // Step 2: glow ring expands slightly (JS-only, runs in parallel with logo)
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start();

    // Step 3: tagline slides up after logo settles
    Animated.sequence([
      Animated.delay(380),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.spring(taglineY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 22,
          bounciness: 5,
        }),
      ]),
    ]).start();
  }, []);

  // ── Session check — navigate away after 1.9 s ────────────────────────────
  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1900));
        if (!mounted) return;

        const [userPhone, session] = await Promise.all([
          AsyncStorage.getItem('userPhone'),
          getSession(),
        ]);

        const destination = userPhone || session ? 'Landing' : 'Login';
        navigation.reset({ index: 0, routes: [{ name: destination }] });
      } catch {
        if (mounted) navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    };

    check();
    return () => { mounted = false; };
  }, [navigation]);

  return (
    <View style={splashStyles.container}>
      {/* ── Outer glow ring ── */}
      <Animated.View style={[splashStyles.glowRing, { opacity: glowOpacity }]} />

      {/* ── Logo circle ── */}
      <Animated.View
        style={[
          splashStyles.circle,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={splashStyles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ── Tagline ── */}
      <Animated.Text
        style={[
          splashStyles.tagline,
          { opacity: taglineOpacity, transform: [{ translateY: taglineY }] },
        ]}
      >
        Grow your business digitally
      </Animated.Text>
    </View>
  );
}
