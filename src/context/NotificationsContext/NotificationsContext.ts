import { type IRemoteNotification } from '@magicbell/react-headless';
import { createContext, useContext } from 'react';

export interface NotificationsContextValues {
  canFetchMore: boolean;
  fetchMore: () => Promise<void>;
  markAllAsRead: () => void;
  mutedColonyAddresses: string[];
  notifications: IRemoteNotification[];
  totalPages: number;
  unreadCount: number;
}

export const NotificationsContext = createContext<
  NotificationsContextValues | undefined
>(undefined);

export const useNotificationsContext = () => {
  const ctx = useContext(NotificationsContext);

  if (!ctx) {
    throw new Error(
      'This hook must be used within the "NotificationsContext" provider',
    );
  }

  return ctx;
};
