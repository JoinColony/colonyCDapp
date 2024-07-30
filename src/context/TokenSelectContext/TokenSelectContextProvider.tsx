import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { useGetTokensListQuery } from '~gql';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import { notNull } from '~utils/arrays/index.ts';
import { type TokenSearchItemOption } from '~v5/common/ActionSidebar/partials/TokenSelect/partials/TokenSearchItem/types.ts';

import { TokenSelectContext } from './TokenSelectContext.ts';

const TokenSelectContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const allTokens = useGetAllTokens();

  const { data: tokensListData, loading } = useGetTokensListQuery({
    variables: {
      isValidated: true,
    },
  });

  const predefinedTokens =
    tokensListData?.listTokens?.items.filter(notNull) ?? [];

  const suggestedOptions: TokenSearchItemOption[] = predefinedTokens.map(
    (item) => ({
      label: item.name,
      value: item.tokenAddress,
      token: item,
    }),
  );

  const allTokensOptions: TokenSearchItemOption[] = [
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
