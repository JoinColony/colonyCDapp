import React, { type PropsWithChildren, useEffect, useMemo } from 'react';

import { useCheckKycStatusMutation } from '~gql';

import { CryptoToFiatContext } from './CryptoToFiatContext.ts';

const CryptoToFiatContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [getKycStatusData, { loading, data }] = useCheckKycStatusMutation();

  useEffect(() => {
    getKycStatusData();
  }, [getKycStatusData]);

  const value = useMemo(
    () => ({
      getKycStatusData,
      kycStatusData: data?.bridgeXYZMutation,
      bankAccountData: data?.bridgeXYZMutation?.bankAccount,
      isKycStatusDataLoading: loading,
    }),
    [data, getKycStatusData, loading],
  );

  return (
    <CryptoToFiatContext.Provider value={value}>
      {children}
    </CryptoToFiatContext.Provider>
  );
};

export default CryptoToFiatContextProvider;
