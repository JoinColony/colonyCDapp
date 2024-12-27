import { createContext, useContext } from 'react';

import {
  type TokenOption,
  type SearchSelectOption,
} from '~v5/shared/SearchSelect/types.ts';

export const TokenSelectContext = createContext<
  | {
      isLoading?: boolean;
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
      setOptions: React.Dispatch<
        React.SetStateAction<SearchSelectOption<TokenOption>[]>
      >;
      options: SearchSelectOption<TokenOption>[];
      suggestedOptions: SearchSelectOption<TokenOption>[];
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
