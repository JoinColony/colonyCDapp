import React, { type PropsWithChildren, useMemo } from 'react';

import { useCheckKycStatusQuery } from '~gql';

import { CryptoToFiatContext } from './CryptoToFiatContext.ts';

const CryptoToFiatContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { data, loading, refetch } = useCheckKycStatusQuery({
    fetchPolicy: 'cache-and-network',
  });

  const value = useMemo(
    () => ({
      refetchKycData: refetch,
      kycStatusData: data?.bridgeCheckKYC,
      bankAccountData: data?.bridgeCheckKYC?.bankAccount,
      isKycStatusDataLoading: loading,
    }),
    [data?.bridgeCheckKYC, loading, refetch],
  );

  return (
    <CryptoToFiatContext.Provider value={value}>
      {children}
    </CryptoToFiatContext.Provider>
  );
};

export default CryptoToFiatContextProvider;
