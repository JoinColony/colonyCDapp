import { isAddress } from 'ethers/lib/utils';
import React, { useMemo } from 'react';

import { useTokenSelectContext } from '~context/TokenSelectContext/TokenSelectContext.ts';
import { useGetTokenFromEverywhereQuery } from '~gql';
import { formatText } from '~utils/intl.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import TokenStatus from './partials/TokenStatus/TokenStatus.tsx';

export const useTokenSelect = (inputValue: string | undefined) => {
  const { options, isLoading } = useTokenSelectContext();

  const isRemoteTokenAddress = useMemo(
    () =>
      !!inputValue &&
      isAddress(inputValue) &&
      !options.some(({ token }) => token?.tokenAddress === inputValue),
    [options, inputValue],
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
    if (!inputValue) {
      return formatText({ id: 'manageTokensTable.select' });
    }

    if (isLoading || loading) {
      return (
        <div className="h-[1.5rem] w-full max-w-[8.75rem] skeleton before:rounded" />
      );
    }

    const selectedToken =
      options.find(({ value }) => value === inputValue)?.token ||
      tokenData?.getTokenFromEverywhere?.items?.[0];

    return selectedToken ? (
      <div className="flex w-full items-center gap-2">
        <TokenAvatar
          size={18}
          tokenName={selectedToken.name}
          tokenAddress={selectedToken.tokenAddress}
          tokenAvatarSrc={selectedToken?.avatar ?? undefined}
        />

        <p className="truncate">
          {selectedToken.name || selectedToken.tokenAddress}
        </p>
      </div>
    ) : (
      <TokenStatus status="error">
        {formatText({ id: 'manageTokensTable.notFound' })}
      </TokenStatus>
    );
  };

  return {
    renderButtonContent,
  };
};
