import { createContext, useContext } from 'react';

interface ColonyDashboardContextValues {
  openLeaveColonyModal: VoidFunction;
  closeLeaveColonyModal: VoidFunction;
  isLeaveColonyModalOpen: boolean;
}

export const ColonyDashboardContext = createContext<
  ColonyDashboardContextValues | undefined
>(undefined);

export const useColonyDashboardContext = () => {
  const context = useContext(ColonyDashboardContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "ColonyDashboardContext" provider',
    );
  }

  return context;
};
