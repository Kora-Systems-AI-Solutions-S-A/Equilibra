import { create } from 'zustand';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationState {
    notifications: Notification[];
    showNotification: (message: string, type?: NotificationType) => void;
    hideNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    showNotification: (message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);

        set((state) => {
            const newNotifications = [{ id, message, type }, ...state.notifications].slice(0, 3);
            return { notifications: newNotifications };
        });

        // Auto-hide após 4 segundos (um pouco mais para stack)
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 4000);
    },
    hideNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
