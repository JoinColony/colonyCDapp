import { createContext, useContext } from 'react';

export interface AdditionalFormOptionsContextValue {
  readonly?: boolean;
}

export const AdditionalFormOptionsContext =
  createContext<AdditionalFormOptionsContextValue>({});

export const useAdditionalFormOptionsContext = () =>
  useContext(AdditionalFormOptionsContext);
