import { createContext, useContext } from 'react';

export interface NotificationsUserContextValues {
  areNotificationsEnabled: boolean;
  mutedColonyAddresses: string[];
}

export const NotificationsUserContext = createContext<
  NotificationsUserContextValues | undefined
>(undefined);

export const useNotificationsUserContext = () => {
  const ctx = useContext(NotificationsUserContext);

  if (!ctx) {
    throw new Error(
      'This hook must be used within the "NotificationsUserContext" provider',
    );
  }

  return ctx;
};
