import React from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../styles/colors';

export default function UserDetailsScreen({ route, navigation }) {
  const user = route.params?.user || {};

  const handleLike = () => {
    // Implement like logic here
    alert('Liked!');
  };

  const handleShare = async () => {
    // Navigate to share contacts page
    navigation.navigate('ShareContacts', { user });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top Bar: Name | Like | Share */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, backgroundColor: '#fff', elevation: 2 }}>
        {/* Name (left) */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.accent, flex: 1 }} numberOfLines={1}>{user.name || 'Unknown'}</Text>
        {/* Like (center) */}
        <TouchableOpacity onPress={handleLike} style={{ marginHorizontal: 16 }}>
          <Ionicons name="heart-outline" size={28} color={COLORS.accent} />
        </TouchableOpacity>
        {/* Share (right) */}
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-social-outline" size={28} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
      {/* User Details */}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Card Details</Text>
        {Object.entries(user).map(([key, value]) => (
          <View key={key} style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text style={{ fontWeight: '500', width: 110, color: '#555' }}>{key}:</Text>
            <Text style={{ color: '#222' }}>{String(value)}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
