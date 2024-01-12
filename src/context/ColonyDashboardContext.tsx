import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

interface ColonyDashboardContextValues {
  openLeaveColonyModal: VoidFunction;
  closeLeaveColonyModal: VoidFunction;
  isLeaveColonyModalOpen: boolean;
}
export const ColonyDashboardContext = createContext<
  ColonyDashboardContextValues | undefined
>(undefined);

export const ColonyDashboardProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLeaveColonyModalOpen, setIsLeaveColonyModalOpen] = useState(false);

  const openLeaveColonyModal = () => {
    setIsLeaveColonyModalOpen(true);
  };

  const closeLeaveColonyModal = () => {
    setIsLeaveColonyModalOpen(false);
  };

  const value = useMemo(() => {
    return {
      isLeaveColonyModalOpen,
      closeLeaveColonyModal,
      openLeaveColonyModal,
    };
  }, [isLeaveColonyModalOpen]);

  return (
    <ColonyDashboardContext.Provider value={value}>
      {children}
    </ColonyDashboardContext.Provider>
  );
};

export const useColonyDashboardContext = () => {
  const context = useContext(ColonyDashboardContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "ColonyDashboardContext" provider',
    );
  }

  return context;
};
