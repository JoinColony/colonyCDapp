import { createContext, useContext } from 'react';

import { type TokenSearchItemOption } from '~v5/common/ActionSidebar/partials/TokenSelect/partials/TokenSearchItem/types.ts';

export const TokenSelectContext = createContext<
  | {
      isLoading?: boolean;
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
      setOptions: React.Dispatch<React.SetStateAction<TokenSearchItemOption[]>>;
      options: TokenSearchItemOption[];
      suggestedOptions: TokenSearchItemOption[];
    }
  | undefined
>(undefined);

export const useTokenSelectContext = () => {
  const context = useContext(TokenSelectContext);

  if (context === undefined) {
    throw new Error(
      'useTokenSelectContext must be used within the TokenSelectContextProvider',
    );
  }

  return context;
};
