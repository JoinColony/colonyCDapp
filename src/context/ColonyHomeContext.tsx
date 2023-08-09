import React, { ReactNode, createContext, useContext } from 'react';
import { EnabledExtensionData, useEnabledExtensions } from '~hooks';

export const ColonyHomeContext = createContext<
  EnabledExtensionData | undefined
>(undefined);

export const ColonyHomeProvider = ({ children }: { children: ReactNode }) => {
  const enabledExtensionsReturn = useEnabledExtensions();
  return (
    <ColonyHomeContext.Provider value={enabledExtensionsReturn}>
      {children}
    </ColonyHomeContext.Provider>
  );
};

export const useColonyHomeContext = () => {
  const context = useContext(ColonyHomeContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the "ColonyHomeContext" provider',
    );
  }

  return context;
};
