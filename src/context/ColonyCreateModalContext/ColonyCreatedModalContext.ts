import { createContext, useContext } from 'react';

import type React from 'react';

export const ColonyCreatedModalContext = createContext<
  | undefined
  | {
      isColonyCreatedModalOpen: boolean;
      setIsColonyCreatedModalOpen: React.Dispatch<
        React.SetStateAction<boolean>
      >;
    }
>(undefined);

export const useColonyCreatedModalContext = () => {
  const context = useContext(ColonyCreatedModalContext);

  if (context === undefined) {
    throw new Error(
      'useColonyCreatedModalContext must be used within a ColonyCreatedModalProvider',
    );
  }

  return context;
};
