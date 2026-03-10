import { Client } from '@stomp/stompjs';
import { BASE_URL, getSessionCookie } from './api';

const WS_ENDPOINT = '/ws';
const SHARE_CARD_DESTINATION = '/app/share-card';

class WebsocketService {
  constructor() {
    this.client = null;
    this.userId = null;
    this.connected = false;
    this.subscriptions = [];
    this.inboxListeners = new Set();
    this.recentMessageIds = new Set();
    this.recentMessageBodies = new Set();
  }

  isConnected() {
    return this.connected && this.client?.connected;
  }

  async connect(userId) {
    const nextUserId = String(userId || '');
    if (!nextUserId) return;

    if (this.isConnected() && this.userId === nextUserId) {
      this.ensureInboxSubscription();
      return;
    }

    if (this.client?.active && this.userId === nextUserId) {
      return;
    }

    if (this.client?.active) {
      await this.disconnect();
    }

    this.userId = nextUserId;
    const cookie = await getSessionCookie();
    const connectHeaders = cookie ? { Cookie: cookie } : {};

    const wsUrl = `${BASE_URL}${WS_ENDPOINT}/websocket`.replace(/^http/, 'ws');

    this.client = new Client({
      webSocketFactory: () => new WebSocket(wsUrl),
      connectHeaders,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
      onConnect: () => {
        this.connected = true;
        this.ensureInboxSubscription();
      },
      onWebSocketClose: () => {
        this.connected = false;
        this.subscriptions = [];
      },
      onStompError: () => {},
    });

    this.client.activate();
  }

  ensureInboxSubscription() {
    if (!this.isConnected()) return;
    if (this.subscriptions.length > 0) return;

    const onMessage = (frame) => {
      const messageId = frame?.headers?.['message-id'];
      const bodyText = frame?.body || '';

      if (messageId && this.recentMessageIds.has(messageId)) return;
      if (!messageId && this.recentMessageBodies.has(bodyText)) return;

      if (messageId) this.recentMessageIds.add(messageId);
      if (!messageId) this.recentMessageBodies.add(bodyText);

      if (this.recentMessageIds.size > 200) {
        this.recentMessageIds = new Set(Array.from(this.recentMessageIds).slice(-100));
      }
      if (this.recentMessageBodies.size > 200) {
        this.recentMessageBodies = new Set(Array.from(this.recentMessageBodies).slice(-100));
      }

      let payload = null;
      try {
        payload = bodyText ? JSON.parse(bodyText) : null;
      } catch {
        payload = null;
      }

      this.inboxListeners.forEach((cb) => cb(payload));
    };

    // Some backends use "/user/queue/cards", while others include the user id in the path.
    this.subscriptions.push(this.client.subscribe('/user/queue/cards', onMessage));
    this.subscriptions.push(
      this.client.subscribe(`/user/${this.userId}/queue/cards`, onMessage)
    );
  }

  subscribeToInbox(callback) {
    this.inboxListeners.add(callback);
    this.ensureInboxSubscription();
    return () => {
      this.inboxListeners.delete(callback);
    };
  }

  sendShareCard(payload) {
    if (!this.isConnected()) return false;

    this.client.publish({
      destination: SHARE_CARD_DESTINATION,
      body: JSON.stringify(payload),
    });

    return true;
  }

  async disconnect() {
    this.subscriptions.forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch {
        // no-op
      }
    });
    this.subscriptions = [];
    this.inboxListeners.clear();
    this.recentMessageIds.clear();
    this.recentMessageBodies.clear();
    this.connected = false;
    this.userId = null;

    if (this.client) {
      await this.client.deactivate();
      this.client = null;
    }
  }
}

const websocketService = new WebsocketService();
export default websocketService;
