import React, { type PropsWithChildren, useMemo } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useCheckKycStatusQuery } from '~gql';

import { CryptoToFiatContext } from './CryptoToFiatContext.ts';

const CryptoToFiatContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { user } = useAppContext();
  const { data, loading, refetch } = useCheckKycStatusQuery({
    fetchPolicy: 'cache-and-network',
    skip: !user,
  });

  const value = useMemo(
    () => ({
      refetchKycData: refetch,
      kycStatusData: data?.bridgeCheckKYC,
      bankAccountData: data?.bridgeCheckKYC?.bankAccount,
      isKycStatusDataLoading: loading || !user,
    }),
    [data?.bridgeCheckKYC, loading, refetch, user],
  );

  return (
    <CryptoToFiatContext.Provider value={value}>
      {children}
    </CryptoToFiatContext.Provider>
  );
};

export default CryptoToFiatContextProvider;
