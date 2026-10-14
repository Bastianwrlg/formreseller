import { FormData } from '../types/form';
import { FormPageSettings } from '../types/formSettings';

export type SyncEventType =
  | 'NEW_APPLICATION'
  | 'APPLICATION_UPDATED'
  | 'SETTINGS_UPDATED'
  | 'FORCE_REFRESH';

export interface SyncEvent {
  type: SyncEventType;
  timestamp: string;
  payload?: {
    application?: FormData;
    settings?: FormPageSettings;
    id?: string;
  };
}

const CHANNEL_NAME = 'poda_reseller_sync_channel_v1';
const STORAGE_TRIGGER_KEY = 'poda_sync_storage_event_v1';

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported or restricted in iframe', e);
}

const listeners: Set<(event: SyncEvent) => void> = new Set();

// Setup listener for BroadcastChannel
if (broadcastChannel) {
  broadcastChannel.onmessage = (messageEvent) => {
    if (messageEvent?.data) {
      notifyListeners(messageEvent.data);
    }
  };
}

// Setup fallback listener for Storage Event (across tabs)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_TRIGGER_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue) as SyncEvent;
        notifyListeners(parsed);
      } catch (err) {
        // Ignore parse error
      }
    }
  });
}

function notifyListeners(event: SyncEvent) {
  listeners.forEach((callback) => {
    try {
      callback(event);
    } catch (err) {
      console.error('Error in sync listener:', err);
    }
  });
}

/**
 * Broadcast an event to all open tabs / windows instantly
 */
export function broadcastSyncEvent(
  type: SyncEventType,
  payload?: SyncEvent['payload']
) {
  const event: SyncEvent = {
    type,
    timestamp: new Date().toISOString(),
    payload,
  };

  // 1. BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(event);
    } catch (err) {
      // Channel might be closed
    }
  }

  // 2. Storage event fallback
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_TRIGGER_KEY, JSON.stringify(event));
    } catch (err) {
      // Storage quota or restriction
    }
  }

  // 3. Notify current window listeners too
  notifyListeners(event);
}

/**
 * Subscribe to real-time events. Returns an unsubscribe function.
 */
export function subscribeToSync(callback: (event: SyncEvent) => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
