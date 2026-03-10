import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/colors';

const AppHeader = () => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.accent} />
        </TouchableOpacity>

        <Text style={styles.title}>DIGITAL BUSINESS CARD</Text>

        {/* Spacer to balance the back button */}
        <View style={styles.spacer} />
      </View>

      {/* Two-tone accent bar: full gold line + inner shimmer line */}
      <View style={styles.accentBar}>
        <View style={styles.accentBarInner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 58,
    width: '100%',
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  spacer: {
    width: 36,
  },
  accentBar: {
    height: 3,
    width: '100%',
    backgroundColor: COLORS.accent,
  },
  accentBarInner: {
    position: 'absolute',
    top: 0,
    left: '15%',
    width: '70%',
    height: 3,
    backgroundColor: '#E8CC6A',
    opacity: 0.55,
    borderRadius: 2,
  },
});

export default AppHeader;
