import React, { createContext, useContext, useMemo, useState } from 'react';

const ColonyCreatedModalContext = createContext<
  | undefined
  | {
      isColonyCreatedModalOpen: boolean;
      setIsColonyCreatedModalOpen: React.Dispatch<
        React.SetStateAction<boolean>
      >;
    }
>(undefined);

export const ColonyCreatedModalProvider = ({
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

export const useColonyCreatedModalContext = () => {
  const context = useContext(ColonyCreatedModalContext);

  if (context === undefined) {
    throw new Error(
      'useColonyCreatedModalContext must be used within a ColonyCreatedModalProvider',
    );
  }

  return context;
};
