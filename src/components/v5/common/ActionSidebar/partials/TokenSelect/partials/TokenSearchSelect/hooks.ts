import { isAddress } from 'ethers/lib/utils';
import { useEffect, useMemo } from 'react';

import { useTokenSelectContext } from '~context/TokenSelectContext/TokenSelectContext.ts';
import { useGetTokenFromEverywhereQuery } from '~gql';
import { formatText } from '~utils/intl.ts';

import { type TokenSearchItemOption } from '../TokenSearchItem/types.ts';

export const useSearchSelect = (
  searchValue: string,
  filterOptionsFn?: (option: TokenSearchItemOption) => boolean,
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

  const searchedOptions: TokenSearchItemOption[] = useMemo(
    () =>
      options.filter((option) => {
        const searchQuery = searchValue.toLowerCase();
        const optionValue =
          typeof option.value === 'string'
            ? option.value.replace('-', ' ').toLowerCase()
            : option.value;
        const optionUserName = formatText(option.label).toLowerCase();

        return [optionValue, optionUserName].some((value) =>
          value.toString().includes(searchQuery),
        );
      }),

    [options, searchValue],
  );

  const filteredOptions = useMemo(
    () =>
      filterOptionsFn
        ? searchedOptions.filter(filterOptionsFn)
        : searchedOptions,
    [filterOptionsFn, searchedOptions],
  );

  const filteredSuggestedOptions = useMemo(
    () =>
      filterOptionsFn
        ? suggestedOptions.filter(filterOptionsFn)
        : suggestedOptions,
    [filterOptionsFn, suggestedOptions],
  );

  return {
    filteredOptions,
    loading,
    suggestedOptions: filteredSuggestedOptions,
  };
};
