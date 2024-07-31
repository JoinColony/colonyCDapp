import { createContext, useContext } from 'react';

import { type BridgeBankAccount } from '~types/graphql.ts';

import { type KycStatusData } from '../types.ts';

interface CryptoToFiatPageContext {
  kycStatusData?: KycStatusData | null;
  bankAccountData?: BridgeBankAccount | null;
  refetchKycData: () => void;
  isKycStatusDataLoading: boolean;
}

export const CryptoToFiatContext = createContext<
  CryptoToFiatPageContext | undefined
>(undefined);

export const useCryptoToFiatContext = () => {
  const context = useContext(CryptoToFiatContext);

  if (!context) {
    throw new Error(
      'This hook must be used within the CryptoToFiatContextProvider',
    );
  }

  return context;
};
