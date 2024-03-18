import React, { type ReactNode, useMemo, useState } from 'react';

import { ColonyDashboardContext } from './ColonyDashboardContext.ts';

const ColonyDashboardProvider = ({ children }: { children: ReactNode }) => {
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

export default ColonyDashboardProvider;
