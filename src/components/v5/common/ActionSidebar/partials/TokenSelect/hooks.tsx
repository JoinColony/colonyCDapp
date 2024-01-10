import { isAddress } from '@ethersproject/address';
import React, { useMemo } from 'react';

import getTokenList from '~common/Dialogs/TokenManagementDialog/TokenManagementDialogForm/getTokenList';
import { useGetTokenFromEverywhereQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { useGetAllTokens } from '~hooks/useGetAllTokens';
import { SpinnerLoader } from '~shared/Preloaders';
import TokenIcon from '~shared/TokenIcon/TokenIcon';
import { formatText } from '~utils/intl';
import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';

import TokenStatus from './partials/TokenStatus/TokenStatus';

export const useTokenSelect = (inputValue: string) => {
  const predefinedTokens = getTokenList();
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
