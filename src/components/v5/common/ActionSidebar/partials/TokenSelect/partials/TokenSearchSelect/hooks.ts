import { isAddress } from 'ethers/lib/utils';
import { useEffect, useMemo } from 'react';

import { useTokenSelectContext } from '~context/TokenSelectContext/TokenSelectContext.ts';
import { useGetTokenFromEverywhereQuery } from '~gql';
import {
  type TokenOption,
  type SearchSelectOption,
} from '~v5/shared/SearchSelect/types.ts';

export const useSearchSelect = (
  searchValue: string,
  filterOptionsFn?: (option: SearchSelectOption<TokenOption>) => boolean,
) => {
  const { setOptions, options, suggestedOptions } = useTokenSelectContext();

  const isRemoteTokenAddress = useMemo(
    () =>
      !!searchValue &&
      isAddress(searchValue) &&
      !options.some(({ token }) => token?.tokenAddress === searchValue),
    [options, searchValue],
  );

  const { data: tokenData, loading } = useGetTokenFromEverywhereQuery({
    variables: {
      input: {
        tokenAddress: searchValue || '',
      },
    },
    skip: !isRemoteTokenAddress || !isAddress(searchValue),
  });

  useEffect(() => {
    const newTokenData = tokenData?.getTokenFromEverywhere?.items?.[0];

    if (newTokenData) {
      setOptions((prevOptions) => {
        if (
          prevOptions.some(
            ({ token }) => token?.tokenAddress === newTokenData?.tokenAddress,
          )
        ) {
          return prevOptions;
        }

        return [
          ...prevOptions,
          {
            label: newTokenData.name,
            value: newTokenData.tokenAddress,
            token: newTokenData,
          },
        ];
      });
    }
  }, [setOptions, tokenData?.getTokenFromEverywhere?.items]);

  const items = useMemo(() => {
    const sourceOptions = searchValue ? options : suggestedOptions;
    const filteredOptions = filterOptionsFn
      ? sourceOptions.filter(filterOptionsFn)
      : sourceOptions;

    return [
      {
        key: 'tokens',
        title: !searchValue
          ? {
              id: 'manageTokensTable.suggestedTokens',
            }
          : undefined,
        options: filteredOptions,
      },
    ];
  }, [searchValue, options, suggestedOptions, filterOptionsFn]);

  return {
    loading,
    items,
  };
};
