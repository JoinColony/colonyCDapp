import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

import noop from '~utils/noop.ts';

export const SearchContext = createContext<{
  searchValue: string;
  setSearchValue: (value: string) => void;
}>({ searchValue: '', setSearchValue: noop });

export const SearchContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchValue, setSearchValue] = useState('');

  const value = useMemo(
    () => ({ searchValue, setSearchValue }),
    [searchValue, setSearchValue],
  );

  return (
    <SearchContext.Provider {...{ value }}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
