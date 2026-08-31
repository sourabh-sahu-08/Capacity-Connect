import { create } from 'zustand';

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  socketConnected: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  setSocketConnected: (status: boolean) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: true,
  socketConnected: false,

  setNotifications: (notifications) => set({ notifications, isLoading: false }),

  addNotification: (notification) => {
    const current = get().notifications;
    // Deduplicate
    if (!current.find((n) => n._id === notification._id)) {
      set({ notifications: [notification, ...current] });
    }
  },

  setUnreadCount: (count) => set({ unreadCount: count }),
  
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),

  markAsRead: (id) => set((state) => {
    let decreased = false;
    const newNotifications = state.notifications.map((n) => {
      if (n._id === id && !n.isRead) {
        decreased = true;
        return { ...n, isRead: true };
      }
      return n;
    });
    return {
      notifications: newNotifications,
      unreadCount: decreased ? Math.max(0, state.unreadCount - 1) : state.unreadCount
    };
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0
  })),

  removeNotification: (id) => set((state) => {
    const notif = state.notifications.find(n => n._id === id);
    const wasUnread = notif && !notif.isRead;
    return {
      notifications: state.notifications.filter(n => n._id !== id),
      unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
    };
  }),

  setSocketConnected: (status) => set({ socketConnected: status }),

  reset: () => set({ notifications: [], unreadCount: 0, isLoading: false, socketConnected: false })
}));
