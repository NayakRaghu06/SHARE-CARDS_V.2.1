import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from "react-native";
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import ExpandableField from '../common/ExpandableField';

// ── Theme — Platinum Silver / Charcoal ───────────────────────────────────────
const CARD_BG   = '#1C1C2E';
const GOLD      = '#C8C8D8';
const AVATAR_BG = '#2A2A3E';
const ICON_BG   = '#0E0E1A';
const GREY_LINE = '#3A3A4E';
const TEXT      = '#FFFFFF';

// ── Animated social icon button ───────────────────────────────────────────────
const IconBtn = ({ iconName, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scale, { toValue: 0.92, friction: 5, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    friction: 5, useNativeDriver: true }).start();
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.iconBtn, { transform: [{ scale }] }]}>
        <Ionicons name={iconName} size={20} color={GOLD} />
      </Animated.View>
    </Pressable>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const DarkTemplate = ({ userData, data }) => {
  const d = data || userData || {};

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental &&
    !global?.nativeFabricUIManager
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [expanded,      setExpanded]      = useState(false);
  const [expandedField, setExpandedField] = useState(null);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((s) => {
      const next = !s;
      if (!next) setExpandedField(null);
      return next;
    });
  };

  const phone   = d.phone || d.mobile || null;
  const initial = d?.name ? d.name.trim().charAt(0).toUpperCase() : 'Y';

  // ── Animations ──────────────────────────────────────────────────────────────
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale   = useRef(new Animated.Value(0.95)).current;
  const avatarScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(cardScale,   { toValue: 1, friction: 7, tension: 70, useNativeDriver: true }),
    ]).start();
    Animated.spring(avatarScale, {
      toValue: 1,
      friction: 5,
      tension: 100,
      delay: 220,
      useNativeDriver: true,
    }).start();
  }, []);

  // ── PDF handler (unchanged) ─────────────────────────────────────────────────
  const handlePdf = async (pdf) => {
    if (!pdf) return;
    try {
      let uri =
        typeof pdf === 'string'
          ? pdf
          : pdf.uri || pdf.fileUri || pdf.localUri || pdf.path || pdf.url || null;

      if (uri && uri.startsWith('data:')) {
        const base64 = uri.split(',')[1];
        const file = new File(Paths.cache, `temp_${Date.now()}.pdf`);
        try {
          file.write(base64, { encoding: 'base64' });
        } catch (e) {
          file.create({ intermediates: true, overwrite: true });
          file.write(base64, { encoding: 'base64' });
        }
        uri = file.uri;
      }

      const available = await Sharing.isAvailableAsync();
      if (available) { await Sharing.shareAsync(uri); return; }

      const supported = uri && (await Linking.canOpenURL(uri));
      if (supported) await Linking.openURL(uri);
      else Alert.alert('Cannot open PDF', 'No handler available for this PDF.');
    } catch (e) {
      Alert.alert('Error opening PDF', e.message || String(e));
    }
  };

  // ── Shared ExpandableField prop spread ─────────────────────────────────────
  const ef = (extra = {}) => ({
    expandedField,
    setExpandedField,
    containerStyle: styles.fieldBox,
    labelStyle:     styles.fieldLabel,
    valueStyle:     styles.fieldValue,
    ...extra,
  });

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: cardOpacity, transform: [{ scale: cardScale }] },
      ]}
    >
      {/* ── Company logo (top-left inside card) ───────────────────────────── */}
      {d?.companyLogo ? (
        <Image source={{ uri: d.companyLogo }} style={styles.companyLogo} />
      ) : null}

      {/* ── Avatar (spring pop) ───────────────────────────────────────────── */}
      <Animated.View style={[styles.avatarOuter, { transform: [{ scale: avatarScale }] }]}>
        <View style={styles.avatarInner}>
          {d?.profileImage ? (
            <Image source={{ uri: d.profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
      </Animated.View>

      {/* ── Gold highlight bar + thin grey separator ──────────────────────── */}
      <View style={styles.goldBar} />
      <View style={styles.greyLine} />

      {/* ── Field cards ───────────────────────────────────────────────────── */}
      <View style={styles.fieldsContainer}>
        <ExpandableField
          label="Name"
          value={d?.name || '-'}
          fieldKey="name"
          {...ef({ valueStyle: [styles.fieldValue, styles.nameValue] })}
        />
        {d?.designation ? (
          <ExpandableField
            label="Designation"
            value={d.designation}
            fieldKey="designation"
            {...ef({ valueStyle: [styles.fieldValue, styles.designationValue] })}
          />
        ) : null}
        {d?.companyName ? (
          <ExpandableField
            label="Company Name"
            value={d.companyName}
            fieldKey="companyName"
            {...ef({ valueStyle: [styles.fieldValue, styles.companyValue] })}
          />
        ) : null}
        {d?.businessCategory || d?.category ? (
          <ExpandableField
            label="Business Category"
            value={d.businessCategory || d.category}
            fieldKey="businessCategory"
            {...ef()}
          />
        ) : null}

        {expanded && (
          <>
            {d?.description || d?.businessDescription ? (
              <ExpandableField
                label="Business Description"
                value={d.description || d.businessDescription}
                fieldKey="businessDescription"
                {...ef()}
              />
            ) : null}
            {phone ? (
              <ExpandableField
                label="Mobile"
                value={phone}
                fieldKey="mobile"
                onPressAction={() => Linking.openURL(`tel:${phone}`)}
                {...ef()}
              />
            ) : null}
            {d?.email ? (
              <ExpandableField
                label="Email"
                value={d.email}
                fieldKey="email"
                onPressAction={() => Linking.openURL(`mailto:${d.email}`)}
                {...ef()}
              />
            ) : null}
            {d?.website ? (
              <ExpandableField
                label="Website"
                value={d.website}
                fieldKey="website"
                onPressAction={() => Linking.openURL(d.website)}
                {...ef()}
              />
            ) : null}
            {d?.address ? (
              <ExpandableField
                label="Address"
                value={d.address}
                fieldKey="address"
                onPressAction={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`
                  )
                }
                {...ef()}
              />
            ) : null}
          </>
        )}
      </View>

      {/* ── QR code ───────────────────────────────────────────────────────── */}
      {d?.qrCodeImage ? (
        <View style={styles.qrContainer}>
          <Image source={{ uri: d.qrCodeImage }} style={styles.qrImage} />
        </View>
      ) : null}

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <View style={styles.divider} />

      {/* ── Social / action icons (press scale animated) ──────────────────── */}
      <View style={styles.socialRow}>
        {phone       ? <IconBtn iconName="call"           onPress={() => Linking.openURL(`tel:${phone}`)} /> : null}
        {d?.whatsapp ? <IconBtn iconName="logo-whatsapp"  onPress={() => Linking.openURL(`https://wa.me/${d.whatsapp.replace(/\D/g, '')}`)} /> : null}
        {d?.linkedin ? <IconBtn iconName="logo-linkedin"  onPress={() => Linking.openURL(d.linkedin)} /> : null}
        {d?.instagram ? (
          <IconBtn
            iconName="logo-instagram"
            onPress={() =>
              Linking.openURL(
                d.instagram.startsWith('http')
                  ? d.instagram
                  : `https://instagram.com/${d.instagram.replace(/^@/, '')}`
              )
            }
          />
        ) : null}
        {d?.twitter        ? <IconBtn iconName="logo-twitter"  onPress={() => Linking.openURL(d.twitter)} /> : null}
        {d?.facebook       ? <IconBtn iconName="logo-facebook" onPress={() => Linking.openURL(d.facebook)} /> : null}
        {d?.website        ? <IconBtn iconName="globe"         onPress={() => Linking.openURL(d.website)} /> : null}
        {d?.descriptionPdf ? <IconBtn iconName="document"      onPress={() => handlePdf(d.descriptionPdf)} /> : null}
        {d?.address ? (
          <IconBtn
            iconName="location"
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`
              )
            }
          />
        ) : null}
      </View>

      {/* ── More / Show Less ──────────────────────────────────────────────── */}
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.85} style={styles.moreBtn}>
        <Text style={styles.moreBtnText}>{expanded ? 'Show Less' : 'More'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default DarkTemplate;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Outer card ──
  card: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: GOLD,
    padding: 22,
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 14,
  },

  // ── Company logo ──
  companyLogo: {
    position: 'absolute',
    left: 32,
    top: 32,
    width: 48,
    height: 48,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: AVATAR_BG,
    borderWidth: 1,
    borderColor: 'rgba(200,200,216,0.4)',
  },

  // ── Avatar ──
  avatarOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  avatarInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: AVATAR_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  avatarText: {
    fontSize: 30,
    color: GOLD,
    fontWeight: 'bold',
  },

  // ── Name highlight bar + grey separator ──
  goldBar: {
    width: '55%',
    height: 8,
    borderRadius: 10,
    backgroundColor: GOLD,
    marginBottom: 8,
  },
  greyLine: {
    width: '40%',
    height: 1.5,
    borderRadius: 4,
    backgroundColor: GREY_LINE,
    marginBottom: 20,
  },

  // ── Fields ──
  fieldsContainer: {
    width: '100%',
    marginTop: 2,
  },
  fieldBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200,200,216,0.28)',
  },
  fieldLabel: {
    color: GOLD,
    fontWeight: '700',
    fontSize: 12,
    minWidth: 96,
  },
  fieldValue: {
    color: TEXT,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  nameValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  designationValue: {
    fontSize: 13,
    color: '#E0E0E0',
  },
  companyValue: {
    fontSize: 13,
    color: '#CBD5E1',
  },

  // ── QR ──
  qrContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  qrImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  // ── Divider ──
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: GREY_LINE,
    marginVertical: 14,
  },

  // ── Social icons row ──
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ICON_BG,
    borderWidth: 1,
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },

  // ── More / Show Less ──
  moreBtn: {
    marginTop: 14,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 28,
  },
  moreBtnText: {
    color: GOLD,
    fontWeight: '700',
    fontSize: 16,
  },
});
