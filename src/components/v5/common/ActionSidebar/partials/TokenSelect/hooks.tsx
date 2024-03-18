import { isAddress } from '@ethersproject/address';
import React, { useMemo } from 'react';

import { getNetworkTokenList } from '~constants/tokens/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetTokenFromEverywhereQuery } from '~gql';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import TokenIcon from '~shared/TokenIcon/TokenIcon.tsx';
import { formatText } from '~utils/intl.ts';
import { type SearchSelectOptionProps } from '~v5/shared/SearchSelect/types.ts';

import TokenStatus from './partials/TokenStatus/TokenStatus.tsx';

export const useTokenSelect = (inputValue: string) => {
  // @TODO: `getNetworkTokenList` and `useGetAllTokens` return the same data - no need to use both
  const predefinedTokens = getNetworkTokenList();
  const allTokens = useGetAllTokens();
  const { colony } = useColonyContext();
  const colonyTokens = colony.tokens?.items || [];
  const isNativeToken = colonyTokens.some(
    (token) => token?.token.tokenAddress === inputValue,
  );

  const tokenOptions: SearchSelectOptionProps = {
    key: 'tokens',
    title: { id: 'manageTokensTable.availableTokens' },
    options: predefinedTokens.map(({ token }) => ({
      label: token.name,
      value: token.tokenAddress,
      token,
    })),
  };

  const isRemoteTokenAddress = useMemo(
    () =>
      inputValue &&
      isAddress(inputValue) &&
      !allTokens.some(({ token }) => token.tokenAddress === inputValue),
    [inputValue, allTokens],
  );

  const { data: tokenData, loading } = useGetTokenFromEverywhereQuery({
    variables: {
      input: {
        tokenAddress: inputValue || '',
      },
    },
    skip: !isRemoteTokenAddress,
  });

  const renderButtonContent = () => {
    if (!isRemoteTokenAddress) {
      if (!inputValue) {
        return formatText({ id: 'manageTokensTable.select' });
      }

      const selectedToken = allTokens.find(
        ({ token }) => token.tokenAddress === inputValue,
      )?.token;

      return (
        <div className="flex items-center gap-2">
          {selectedToken && <TokenIcon token={selectedToken} size="xxs" />}
          {selectedToken?.name}
        </div>
      );
    }

    if (loading) {
      return <SpinnerLoader appearance={{ size: 'small' }} />;
    }

    return tokenData ? (
      <TokenStatus status="success">
        {tokenData.getTokenFromEverywhere?.items?.[0]?.name}
      </TokenStatus>
    ) : (
      <TokenStatus status="error">
        {formatText({ id: 'manageTokensTable.notFound' })}
      </TokenStatus>
    );
  };

  return {
    tokenOptions,
    isRemoteTokenAddress,
    renderButtonContent,
    isNativeToken,
    colonyTokens,
  };
};
