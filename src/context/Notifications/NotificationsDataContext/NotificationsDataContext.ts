import { type IRemoteNotification } from '@magicbell/react-headless';
import { createContext, useContext } from 'react';

export interface NotificationsDataContextValues {
  canFetchMore: boolean;
  fetchMore: () => Promise<void>;
  markAllAsRead: () => void;
  notifications: IRemoteNotification[];
  totalPages: number;
  unreadCount: number;
}

export const NotificationsDataContext = createContext<
  NotificationsDataContextValues | undefined
>(undefined);

export const useNotificationsDataContext = () => {
  const ctx = useContext(NotificationsDataContext);

  if (!ctx) {
    throw new Error(
      'This hook must be used within the "NotificationsDataContext" provider',
    );
  }

  return ctx;
};
