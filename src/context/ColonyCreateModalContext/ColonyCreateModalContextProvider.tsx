import React, { useMemo, useState } from 'react';

import { ColonyCreatedModalContext } from './ColonyCreatedModalContext.ts';

const ColonyCreatedModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isColonyCreatedModalOpen, setIsColonyCreatedModalOpen] =
    useState<boolean>(false);

  const value = useMemo(
    () => ({ isColonyCreatedModalOpen, setIsColonyCreatedModalOpen }),
    [isColonyCreatedModalOpen, setIsColonyCreatedModalOpen],
  );

  return (
    <ColonyCreatedModalContext.Provider value={value}>
      {children}
    </ColonyCreatedModalContext.Provider>
  );
};

export default ColonyCreatedModalContextProvider;
