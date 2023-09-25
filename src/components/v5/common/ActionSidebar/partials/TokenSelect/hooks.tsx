import React, { useMemo } from 'react';
import { isAddress } from '@ethersproject/address';

import getTokenList from '~common/Dialogs/TokenManagementDialog/TokenManagementDialogForm/getTokenList';
import { TokenFragment, useGetTokenFromEverywhereQuery } from '~gql';
import { SpinnerLoader } from '~shared/Preloaders';
import TokenIcon from '~shared/TokenIcon/TokenIcon';
import { formatText } from '~utils/intl';
import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';
import TokenStatus from './partials/TokenStatus/TokenStatus';

export const useTokenSelect = (inputValue: string) => {
  const predefinedTokens = getTokenList();

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
      !predefinedTokens.some(({ token }) => token.tokenAddress === inputValue),
    [inputValue, predefinedTokens],
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

      const selectedToken = predefinedTokens.find(
        ({ token }) => token.tokenAddress === inputValue,
      )?.token as TokenFragment;

      return (
        <div className="flex items-center gap-2">
          <TokenIcon token={selectedToken} size="xxs" />
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
  };
};
