import { createContext, useContext } from 'react';

import { type AdditionalFormOptionsContextValue } from './types.ts';

const AdditionalFormOptionsContext =
  createContext<AdditionalFormOptionsContextValue>({});

export const useAdditionalFormOptionsContext = () =>
  useContext(AdditionalFormOptionsContext);

export const AdditionalFormOptionsContextProvider =
  AdditionalFormOptionsContext.Provider;
