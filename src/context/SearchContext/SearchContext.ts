import { createContext, useContext } from 'react';

import { noop } from '~utils/noop.ts';

export const SearchContext = createContext<{
  searchValue: string;
  setSearchValue: (value: string) => void;
}>({ searchValue: '', setSearchValue: noop });

export const useSearchContext = () => useContext(SearchContext);
