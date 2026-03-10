import * as Contacts from 'expo-contacts';
import { Platform } from 'react-native';

// Request contact permission
export const requestContactPermission = async () => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting contact permission:', error);
    return false;
  }
};

// Read phone contacts
export const readPhoneContacts = async () => {
  try {
    // Get all contacts from device
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
    });

    // Filter and format contacts
    const formattedContacts = data
      .filter(contact => {
        // Only include contacts with phone numbers
        return contact.phoneNumbers && contact.phoneNumbers.length > 0;
      })
      .map(contact => {
        // Get the primary phone number and extract last 10 digits
        const phoneNumber = contact.phoneNumbers[0]?.number || '';
        const cleanedPhone = phoneNumber.replace(/\D/g, '').slice(-10);

        return {
          name: contact.name || 'Unknown',
          phone: cleanedPhone,
        };
      })
      .filter(contact => contact.phone.length === 10) // Only keep valid 10-digit numbers
      .filter((contact, index, self) => {
        // Remove duplicates (same phone number)
        return index === self.findIndex(c => c.phone === contact.phone);
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

    return formattedContacts;
  } catch (error) {
    console.error('Error reading contacts:', error);
    return [];
  }
};

// Compare phone contacts with DBC users
export const compareContactsWithUsers = (phoneContacts, dbcUsers) => {
  return phoneContacts
    .map((phoneContact) => {
      // Find matching DBC user by phone number
      const matchedUser = dbcUsers.find(
        (user) => user.phone === phoneContact.phone
      );

      return {
        ...phoneContact,
        isDBCUser: !!matchedUser,
        dbcUser: matchedUser,
      };
    })
    .sort((a, b) => {
      // Sort: DBC users first, then others
      if (a.isDBCUser !== b.isDBCUser) {
        return a.isDBCUser ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
};

// Get all DBC users (simulated from storage)
export const getDBCUsers = async () => {
  try {
    // In production, fetch from backend or local storage
    return [];
  } catch (error) {
    console.error('Error getting DBC users:', error);
    return [];
  }
};
