import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Session helpers ──────────────────────────────────────────────────────────
export const saveSession = async (phone) => {
  await AsyncStorage.setItem('userSession', phone);
  await AsyncStorage.setItem('loggedInUser', phone);
};

export const getSession = async () => {
  return await AsyncStorage.getItem('userSession');
};

export const clearSession = async () => {
  await AsyncStorage.multiRemove(['userSession', 'loggedInUser', 'userPhone']);
};
// ────────────────────────────────────────────────────────────────────────────

// Card draft helpers: save/read temporary card data across steps
export const saveCardDraft = async (card) => {
  await AsyncStorage.setItem('CARD_DRAFT', JSON.stringify(card));
};

export const getCardDraft = async () => {
  const data = await AsyncStorage.getItem('CARD_DRAFT');
  return data ? JSON.parse(data) : {};
};

export const clearCardDraft = async () => {
  await AsyncStorage.removeItem('CARD_DRAFT');
};

// Dashboard data helpers
export const saveDashboard = async (dashboard) => {
  const user = await AsyncStorage.getItem('loggedInUser');
  await AsyncStorage.setItem(`DASHBOARD_${user}`, JSON.stringify(dashboard));
};

export const getDashboard = async () => {
  const user = await AsyncStorage.getItem('loggedInUser');
  const data = await AsyncStorage.getItem(`DASHBOARD_${user}`);
  return data ? JSON.parse(data) : [];
};

export const clearDashboard = async () => {
  const user = await AsyncStorage.getItem('loggedInUser');
  await AsyncStorage.removeItem(`DASHBOARD_${user}`);
};

// Convenience helpers: add/remove single card to dashboard
export const addDashboardCard = async (card) => {
  try {
    const user = await AsyncStorage.getItem('loggedInUser');
    const data = await AsyncStorage.getItem(`DASHBOARD_${user}`);
    let cards = data ? JSON.parse(data) : [];
    if (!Array.isArray(cards)) cards = [];
    cards.push(card);
    await AsyncStorage.setItem(`DASHBOARD_${user}`, JSON.stringify(cards));
    return cards;
  } catch (e) {
    throw e;
  }
};

export const removeDashboardCard = async (index) => {
  try {
    const user = await AsyncStorage.getItem('loggedInUser');
    const data = await AsyncStorage.getItem(`DASHBOARD_${user}`);
    let cards = data ? JSON.parse(data) : [];
    if (!Array.isArray(cards)) cards = [];
    if (index >= 0 && index < cards.length) {
      cards.splice(index, 1);
      await AsyncStorage.setItem(`DASHBOARD_${user}`, JSON.stringify(cards));
    }
    return cards;
  } catch (e) {
    throw e;
  }
};
