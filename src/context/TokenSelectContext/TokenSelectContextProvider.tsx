import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { useGetTokensListQuery } from '~gql';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  type TokenOption,
  type SearchSelectOption,
} from '~v5/shared/SearchSelect/types.ts';

import { TokenSelectContext } from './TokenSelectContext.ts';

const TokenSelectContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const allTokens = useGetAllTokens();

  const {
    data: tokensListData,
    loading,
    fetchMore,
  } = useGetTokensListQuery({
    variables: {
      isValidated: true,
    },
    onCompleted: (receivedData) => {
      if (receivedData?.listTokens?.nextToken) {
        fetchMore({
          variables: {
            nextToken: receivedData.listTokens.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            // Here, combine the previous items with the newly fetched items
            return {
              ...prev,
              listTokens: {
                ...prev.listTokens,
                items: [
                  ...(prev?.listTokens?.items || []),
                  ...(fetchMoreResult?.listTokens?.items || []),
                ],
                nextToken: fetchMoreResult?.listTokens?.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const predefinedTokens = useMemo(
    () => tokensListData?.listTokens?.items.filter(notNull) || [],
    [tokensListData],
  );

  const suggestedOptions: SearchSelectOption<TokenOption>[] = predefinedTokens
    .filter((token, index, self) => {
      return (
        index === self.findIndex((t) => t.tokenAddress === token.tokenAddress)
      );
    })
    .map((item) => ({
      label: item.name,
      value: item.tokenAddress,
      token: item,
    }));

  const allTokensOptions: SearchSelectOption<TokenOption>[] = [
    ...(allTokens.flatMap(({ token }) => token).filter(notNull) ?? []),
  ].map((item) => ({
    label: item.name,
    value: item.tokenAddress,
    token: item,
  }));

  const [options, setOptions] = useState([
    ...suggestedOptions,
    ...allTokensOptions,
  ]);

  const value = useMemo(
    () => ({
      suggestedOptions,
      options,
      setOptions,
      isLoading: isLoading || loading,
      setIsLoading,
    }),
    [isLoading, loading, options, suggestedOptions],
  );

  return (
    <TokenSelectContext.Provider value={value}>
      {children}
    </TokenSelectContext.Provider>
  );
};

export default TokenSelectContextProvider;
