import { createContext, useContext } from 'react';

export interface NotificationsContextValues {
  mutedColonyIds: string[];
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
