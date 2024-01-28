import { createContext, useContext } from 'react';

import { type AdditionalFormOptionsContextValue } from './types.ts';

const AdditionalFormOptionsContext =
  createContext<AdditionalFormOptionsContextValue>({});

export const useAdditionalFormOptionsContext = () =>
  useContext(AdditionalFormOptionsContext);

const AdditionalFormOptionsContextProvider =
  AdditionalFormOptionsContext.Provider;

export default AdditionalFormOptionsContextProvider;
