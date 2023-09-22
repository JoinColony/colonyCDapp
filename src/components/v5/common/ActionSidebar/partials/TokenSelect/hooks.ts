import { isAddress } from '@ethersproject/address';
import { useMemo } from 'react';
import getTokenList from '~common/Dialogs/TokenManagementDialog/TokenManagementDialogForm/getTokenList';
import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';

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

  return {
    tokenOptions,
    isRemoteTokenAddress,
  };
};
