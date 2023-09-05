import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useColonyContext } from '~hooks';
import { TokenProps } from './types';

export const useTokenTable = () => {
  const { colony } = useColonyContext();
  const { tokens } = colony || {};
  const { unregister } = useFormContext();

  const colonyTokens = tokens?.items || [];

  const mappedColonyTokens = colonyTokens
    .map((token) => token?.token)
    .map((token) => ({
      tokenAddress: token?.tokenAddress || '',
      symbol: token?.symbol || '',
      name: token?.name || '',
      decimals: token?.decimals || 0,
      isTokenNative: true,
      key: token?.tokenAddress || '',
    }));
  const [tokensList, setTokensList] =
    useState<TokenProps[]>(mappedColonyTokens);

  const handleRemoveRowClick = (id: string) => {
    setTokensList(tokensList.filter((item) => item.key !== id));
    unregister(`tokenAddress-${id}`);
    unregister(`token-${id}`);
  };

  const updateTokens = useCallback(
    (key: string, values: TokenProps) => {
      const updatedTokens = tokensList.map((token) => {
        if (token.key === key) {
          return {
            ...token,
            ...values,
          };
        }

        return token;
      });

      setTokensList(updatedTokens);
    },
    [tokensList],
  );

  return {
    tokensList,
    setTokensList,
    handleRemoveRowClick,
    updateTokens,
  };
};
