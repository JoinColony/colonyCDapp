import { createContext, useContext } from 'react';

import {
  type KycStatusData,
  type CheckKycStatusMutationReturnType,
  type KycBankAccountData,
} from '../types.ts';

interface CryptoToFiatPageContext {
  kycStatusData: KycStatusData;
  bankAccountData: KycBankAccountData;
  getKycStatusData: CheckKycStatusMutationReturnType[0];
  isKycStatusDataLoading: CheckKycStatusMutationReturnType[1]['loading'];
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
