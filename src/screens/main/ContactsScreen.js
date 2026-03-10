import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { contactsStyles as S } from '../../styles/screens/contactsStyles';
import {
  requestContactPermission,
  readPhoneContacts,
  compareContactsWithUsers,
  getDBCUsers,
} from '../../utils/contacts';
import Footer from '../../components/common/Footer';

const GOLD = '#C9A227';

// Returns the first letter of the first word (or '?' as fallback)
function initial(name) {
  return (name || '').trim().charAt(0).toUpperCase() || '?';
}

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const hasPermission = await requestContactPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot access contacts without permission');
        setPermissionGranted(false);
        setLoading(false);
        return;
      }
      setPermissionGranted(true);
      const phoneContacts = await readPhoneContacts();
      console.log('Contacts Count:', phoneContacts.length);
      const dbcUsers = await getDBCUsers();
      const mergedContacts = compareContactsWithUsers(phoneContacts, dbcUsers);
      setContacts(mergedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Error', 'Please fill in name and phone number');
      return;
    }
    const updatedContacts = [
      ...contacts,
      { name: newContact.name, phone: newContact.phone, email: newContact.email, isDBCUser: false, dbcUser: null },
    ];
    setContacts(updatedContacts);
    setNewContact({ name: '', phone: '', email: '' });
    setIsAddingContact(false);
    Alert.alert('Success', 'Contact added successfully');
  };

  const handleDeleteContact = (phone) => {
    Alert.alert('Delete Contact', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => setContacts(contacts.filter(c => c.phone !== phone)), style: 'destructive' },
    ]);
  };

  const handleViewDBCCard = (contact) => {
    if (contact.isDBCUser) {
      Alert.alert(
        'DBC Card',
        `${contact.name}\nPhone: ${contact.phone}\nCard Type: ${contact.dbcUser?.card}`
      );
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const dbcContacts   = filteredContacts.filter(c => c.isDBCUser);
  const otherContacts = filteredContacts.filter(c => !c.isDBCUser);

  return (
    <SafeAreaView style={S.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ── */}
      <View style={S.header}>
        <TouchableOpacity style={S.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={GOLD} />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Contacts</Text>
        <TouchableOpacity style={S.headerAddBtn} onPress={() => setIsAddingContact(true)}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={S.loadingContainer}>
          <ActivityIndicator size="large" color={GOLD} />
          <Text style={S.loadingText}>Reading phone contacts…</Text>
        </View>
      ) : !permissionGranted ? (
        <View style={S.loadingContainer}>
          <View style={S.emptyIconCircle}>
            <Ionicons name="lock-closed-outline" size={32} color={GOLD} />
          </View>
          <Text style={S.emptyStateTitle}>Permission Required</Text>
          <Text style={S.permissionText}>We need access to your contacts to find DBC users.</Text>
          <TouchableOpacity style={S.retryButton} onPress={loadContacts}>
            <Text style={S.retryButtonText}>Grant Access</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Search bar */}
          <View style={S.searchBarContainer}>
            <Ionicons name="search" size={18} color={GOLD} style={S.searchIcon} />
            <TextInput
              style={S.searchInput}
              placeholder="Search contacts…"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Add contact form */}
          {isAddingContact && (
            <View style={S.formContainer}>
              <Text style={S.formTitle}>New Contact</Text>

              <View style={S.inputGroup}>
                <Text style={S.label}>Name</Text>
                <TextInput
                  style={S.input}
                  placeholder="Enter name"
                  value={newContact.name}
                  onChangeText={(text) => setNewContact({ ...newContact, name: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={S.inputGroup}>
                <Text style={S.label}>Phone</Text>
                <TextInput
                  style={S.input}
                  placeholder="Enter phone number"
                  value={newContact.phone}
                  onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={S.inputGroup}>
                <Text style={S.label}>Email (optional)</Text>
                <TextInput
                  style={S.input}
                  placeholder="Enter email"
                  value={newContact.email}
                  onChangeText={(text) => setNewContact({ ...newContact, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={S.buttonGroup}>
                <TouchableOpacity
                  style={S.cancelButton}
                  onPress={() => { setIsAddingContact(false); setNewContact({ name: '', phone: '', email: '' }); }}
                >
                  <Text style={S.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={S.addButton} onPress={handleAddContact}>
                  <Text style={S.addButtonText}>Add Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* DBC Contacts */}
          {dbcContacts.length > 0 && (
            <>
              <View style={S.sectionHeader}>
                <Ionicons name="checkmark-circle" size={15} color={GOLD} />
                <Text style={S.sectionTitle}>On ShareCards</Text>
                <Text style={S.sectionCount}>{dbcContacts.length}</Text>
              </View>
              <View style={S.contactsList}>
                {dbcContacts.map((contact, index) => (
                  <TouchableOpacity
                    key={contact?.phone || contact?.email || `dbc-${index}`}
                    style={S.contactItemDBC}
                    onPress={() => handleViewDBCCard(contact)}
                    activeOpacity={0.8}
                  >
                    {/* Avatar */}
                    <View style={S.avatarDBC}>
                      <Text style={S.avatarText}>{initial(contact.name)}</Text>
                    </View>

                    {/* Info */}
                    <View style={S.contactInfo}>
                      <View style={S.nameRow}>
                        <Text style={S.contactName}>{contact.name}</Text>
                        <View style={S.dbcBadge}>
                          <Ionicons name="checkmark-circle" size={11} color={GOLD} />
                          <Text style={S.badgeText}>DBC</Text>
                        </View>
                      </View>
                      <Text style={S.contactPhone}>{contact.phone}</Text>
                      {contact.dbcUser?.card && (
                        <Text style={S.cardType}>{contact.dbcUser.card} Card</Text>
                      )}
                    </View>

                    {/* Delete */}
                    <TouchableOpacity
                      style={S.deleteBtn}
                      onPress={() => handleDeleteContact(contact.phone)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Other Contacts */}
          {otherContacts.length > 0 && (
            <>
              <View style={[S.sectionHeader, dbcContacts.length > 0 && { marginTop: 20 }]}>
                <Ionicons name="people-outline" size={15} color="#9CA3AF" />
                <Text style={S.sectionTitleOther}>Other Contacts</Text>
                <Text style={S.sectionCount}>{otherContacts.length}</Text>
              </View>
              <View style={S.contactsList}>
                {otherContacts.map((contact, index) => (
                  <View
                    key={contact?.phone || contact?.email || `other-${index}`}
                    style={S.contactItem}
                  >
                    {/* Avatar */}
                    <View style={S.avatarOther}>
                      <Text style={S.avatarTextOther}>{initial(contact.name)}</Text>
                    </View>

                    {/* Info */}
                    <View style={S.contactInfo}>
                      <Text style={S.contactName}>{contact.name}</Text>
                      <Text style={S.contactPhone}>{contact.phone}</Text>
                      {contact.email ? (
                        <Text style={S.contactEmail}>{contact.email}</Text>
                      ) : null}
                    </View>

                    {/* Delete */}
                    <TouchableOpacity
                      style={S.deleteBtn}
                      onPress={() => handleDeleteContact(contact.phone)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Empty state */}
          {filteredContacts.length === 0 && !isAddingContact && (
            <View style={S.emptyState}>
              <View style={S.emptyIconCircle}>
                <Ionicons name="people-outline" size={34} color="#9CA3AF" />
              </View>
              <Text style={S.emptyStateTitle}>
                {contacts.length === 0 ? 'No contacts found' : 'No results found'}
              </Text>
              <Text style={S.emptyStateText}>
                {contacts.length === 0
                  ? 'Your phone contacts will appear here.'
                  : `No contacts match "${searchQuery}".`}
              </Text>
            </View>
          )}

        </ScrollView>
      )}

      <Footer activeTab="contacts" navigation={navigation} fromScreen="Contacts" />
    </SafeAreaView>
  );
}
