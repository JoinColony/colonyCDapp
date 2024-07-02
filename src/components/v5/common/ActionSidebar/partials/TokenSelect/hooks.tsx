import { isAddress } from '@ethersproject/address';
import React, { useMemo } from 'react';

import { useGetTokenFromEverywhereQuery, useGetTokensListQuery } from '~gql';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { type TokenSearchSelectOptionProps } from './partials/TokenSearchSelect/types.ts';
import TokenStatus from './partials/TokenStatus/TokenStatus.tsx';

export const useTokenSelect = (inputValue: string | undefined) => {
  const allTokens = useGetAllTokens();

  const { data: tokensListData } = useGetTokensListQuery({
    variables: {
      isValidated: true,
    },
  });

  const predefinedTokens =
    tokensListData?.listTokens?.items.filter(notNull) ?? [];

  const tokenOptions: TokenSearchSelectOptionProps = {
    key: 'tokens',
    title: formatText({ id: 'manageTokensTable.availableTokens' }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: predefinedTokens.map(({ __typename, ...token }) => ({
      label: token.name,
      value: token.tokenAddress,
      token,
    })),
  };

  const isRemoteTokenAddress = useMemo(
    () =>
      !!inputValue &&
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
    if (!inputValue) {
      return formatText({ id: 'manageTokensTable.select' });
    }

    if (loading) {
      return (
        <div className="h-[1.5rem] w-full max-w-[8.75rem] skeleton before:rounded" />
      );
    }

    const selectedToken =
      allTokens.find(({ token }) => token.tokenAddress === inputValue)?.token ||
      tokenData?.getTokenFromEverywhere?.items?.filter(notNull)?.[0];

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
    tokenOptions,
    renderButtonContent,
  };
};
