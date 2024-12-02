import React, { useMemo, useState } from 'react';

import useCloseModals from '~hooks/useCloseModals.ts';

import { ColonyCreatedModalContext } from './ColonyCreatedModalContext.ts';

const ColonyCreatedModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isColonyCreatedModalOpen, setIsColonyCreatedModalOpen] =
    useState<boolean>(false);

  useCloseModals(() => setIsColonyCreatedModalOpen(false));

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
