import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { EnabledExtensionData, useEnabledExtensions } from '~hooks';
import { SetStateFn } from '~types';

interface ColonyHomeContextValues extends EnabledExtensionData {
  domainIdFilter: number;
  setDomainIdFilter: SetStateFn<number>;
}
export const ColonyHomeContext = createContext<
  ColonyHomeContextValues | undefined
>(undefined);

export const ColonyHomeProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryDomainIdFilter = searchParams.get('domainFilter');
  const [domainIdFilter, setDomainIdFilter] = useState<number>(
    Number(queryDomainIdFilter),
  );
  const enabledExtensionsReturn = useEnabledExtensions();

  const value = useMemo(
    () => ({
      ...enabledExtensionsReturn,
      domainIdFilter,
      setDomainIdFilter,
    }),
    [enabledExtensionsReturn, domainIdFilter, setDomainIdFilter],
  );

  return (
    <ColonyHomeContext.Provider value={value}>
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
