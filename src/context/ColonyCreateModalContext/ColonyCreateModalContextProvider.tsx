import React, { useEffect, useMemo, useState } from 'react';

import { ColonyCreatedModalContext } from './ColonyCreatedModalContext.ts';

const ColonyCreatedModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isColonyCreatedModalOpen, setIsColonyCreatedModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const handleCloseModals = () => {
      setIsColonyCreatedModalOpen(false);
    };

    window.addEventListener('closeModals', handleCloseModals);

    return () => window.removeEventListener('closeModals', handleCloseModals);
  }, []);

  const value = useMemo(
    () => ({ isColonyCreatedModalOpen, setIsColonyCreatedModalOpen }),
    [isColonyCreatedModalOpen],
  );

  return (
    <ColonyCreatedModalContext.Provider value={value}>
      {children}
    </ColonyCreatedModalContext.Provider>
  );
};

export default ColonyCreatedModalContextProvider;
