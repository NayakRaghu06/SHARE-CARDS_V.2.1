import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://backend.sharecards.in';

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

// ─────────────────────────────────────────────
//  Session cookie helpers
// ─────────────────────────────────────────────
const SESSION_COOKIE_KEY = 'sessionCookie';

export const getSessionCookie = () => AsyncStorage.getItem(SESSION_COOKIE_KEY);

export const saveSessionCookie = (cookie) =>
  AsyncStorage.setItem(SESSION_COOKIE_KEY, cookie);

export const clearSessionCookie = () =>
  AsyncStorage.removeItem(SESSION_COOKIE_KEY);

// ─────────────────────────────────────────────
//  Core fetch wrapper
//  Fixes header-override bug: options.headers is extracted before spreading
//  so the merged `headers` object always wins.
// ─────────────────────────────────────────────
export const apiFetch = async (endpoint, options = {}) => {
  const storedCookie = await AsyncStorage.getItem(SESSION_COOKIE_KEY);

  // Build merged headers (defaultHeaders → cookie → caller overrides)
  const headers = {
    ...defaultHeaders,
    ...(storedCookie ? { Cookie: storedCookie } : {}),
    ...(options.headers || {}),
  };

  // Drop `headers` from options before spreading so it can't override our merged headers
  const { headers: _dropped, ...restOptions } = options;

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...restOptions,
      headers,       // always applied last — guaranteed to be the merged set
    });

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    // Capture session cookie if the backend returns it
    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookieValue = setCookieHeader.split(';')[0].trim();
      if (cookieValue) await AsyncStorage.setItem(SESSION_COOKIE_KEY, cookieValue);
    } else if (data?.sessionId) {
      await AsyncStorage.setItem(SESSION_COOKIE_KEY, `JSESSIONID=${data.sessionId}`);
    }

    return { res, data };
  } catch (err) {
    throw new Error(err.message || 'Network request failed');
  }
};

export const getApiErrorMessage = (res, data, fallback = 'Request failed') => {
  const statusPrefix = res?.status ? `[${res.status}] ` : '';

  if (typeof data === 'string' && data.trim()) {
    return `${statusPrefix}${data}`;
  }

  const msg =
    data?.message ||
    data?.error ||
    data?.detail ||
    data?.raw ||
    (Array.isArray(data?.errors) ? data.errors.join(', ') : null);

  if (typeof msg === 'string' && msg.trim()) {
    return `${statusPrefix}${msg}`;
  }

  return `${statusPrefix}${fallback}`;
};


// ════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════

export const sendPhoneOtp = (mobileNumber) =>
  apiFetch('/auth/mobile-signup', {
    method: 'POST',
    body: JSON.stringify({ mobileNumber: Number(mobileNumber) }),
  });

export const verifyPhoneOtp = (mobileNumber, otp) =>
  apiFetch('/auth/verify-phone-otp', {
    method: 'POST',
    body: JSON.stringify({ mobileNumber: Number(mobileNumber), otp }),
  });

export const sendEmailOtp = (email) =>
  apiFetch('/auth/send-email-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const verifyEmailOtp = (email, otp) =>
  apiFetch('/auth/verify-email-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });

export const finalSignup = (firstName, middleName, lastName, mobileNumber, email) =>
  apiFetch('/auth/final-submit', {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      middleName,
      lastName,
      mobileNumber: Number(mobileNumber),
      email: email?.trim() || null,
    }),
  });

export const sendLoginOtp = (mobileNumber) =>
  apiFetch('/auth/mobile/login', {
    method: 'POST',
    body: JSON.stringify({ mobileNumber: Number(mobileNumber) }),
  });

export const verifyLoginOtp = (mobileNumber, otp) =>
  apiFetch('/auth/login/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ mobileNumber: Number(mobileNumber), otp }),
  });

export const logout = () =>
  apiFetch('/auth/logout', { method: 'POST' });


// ════════════════════════════════════════════
//  PROFILE
// ════════════════════════════════════════════

export const getProfile = () =>
  apiFetch('/user/profile');

export const updateProfile = (profileData) =>
  apiFetch('/user/update-profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });


// ════════════════════════════════════════════
//  BUSINESS CARD  (/api/cards)
// ════════════════════════════════════════════

export const createCard = (cardData) =>
  apiFetch('/api/cards/business-card', {
    method: 'POST',
    body: JSON.stringify(cardData),
  });

export const getMyCards = () =>
  apiFetch('/api/cards/view-cards');

export const updateCard = (cardId, cardData) =>
  apiFetch(`/api/cards/update-card/${cardId}`, {
    method: 'PUT',
    body: JSON.stringify(cardData),
  });

export const deleteCard = (cardId) =>
  apiFetch(`/api/cards/delete-card/${cardId}`, { method: 'DELETE' });


export const getPublicCard = (cardId) =>
  apiFetch(`/api/card/public/${cardId}`);

export const getCardById = (cardId) =>
  apiFetch(`/cards/${cardId}`);


// ════════════════════════════════════════════
//  SHARE  (/api/share)
// ════════════════════════════════════════════

export const checkUser = (mobileNumber) =>
  apiFetch(`/api/share/check-user?mobileNumber=${mobileNumber}`);

export const shareCardInApp = (senderId, receiverMobile, cardId) =>
  apiFetch('/api/share', {
    method: 'POST',
    body: JSON.stringify({
      senderId: Number(senderId),
      receiverMobile: Number(receiverMobile),
      cardId: Number(cardId),
    }),
  });

export const shareCardWhatsApp = (senderId, receiverMobile, cardId) =>
  apiFetch('/api/share/whatsapp', {
    method: 'POST',
    body: JSON.stringify({
      senderId: Number(senderId),
      receiverMobile: Number(receiverMobile),
      cardId: Number(cardId),
    }),
  });

export const getReceivedCards = () =>
  apiFetch(`/api/share/received`);

export const saveCard = (cardId) =>
  apiFetch('/api/save-card', {
    method: 'POST',
    body: JSON.stringify({ cardId: Number(cardId) }),
  });

export const markCardViewed = (shareId) =>
  apiFetch(`/api/share/view/${shareId}`, { method: 'PUT' });

export const unshareCard = (shareId, userId) =>
  apiFetch(`/api/share/unshare/${shareId}?userId=${userId}`, { method: 'PUT' });

export const generateShareLink = (cardId, recipientName, recipientMobile, recipientEmail) =>
  apiFetch('/api/share/generate-link', {
    method: 'POST',
    body: JSON.stringify({
      cardId: Number(cardId),
      recipientName,
      recipientMobile: recipientMobile ? Number(recipientMobile) : undefined,
      recipientEmail: recipientEmail || undefined,
    }),
  });


// ════════════════════════════════════════════
//  AsyncStorage helpers
// ════════════════════════════════════════════

export const getStoredUserId = () => AsyncStorage.getItem('loggedInUserId');
export const getStoredCardId = () => AsyncStorage.getItem('activeCardId');
export const getStoredPhone  = () => AsyncStorage.getItem('userPhone');

export const saveLoginSession = async (userId, phone) => {
  await AsyncStorage.setItem('loggedInUserId', String(userId));
  await AsyncStorage.setItem('userPhone', String(phone));
};

export const clearLoginSession = async () => {
  await AsyncStorage.multiRemove(['loggedInUserId', 'userPhone', 'activeCardId', SESSION_COOKIE_KEY]);
};

export const saveUserId = (userId) =>
  AsyncStorage.setItem('loggedInUserId', String(userId));

export const getUserId = () =>
  AsyncStorage.getItem('loggedInUserId');

export const clearUserId = () =>
  AsyncStorage.removeItem('loggedInUserId');
