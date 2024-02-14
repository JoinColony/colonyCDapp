import React, {
  type FC,
  type PropsWithChildren,
  useMemo,
  useState,
} from 'react';

import { SearchContext } from './SearchContext.ts';

const SearchContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchValue, setSearchValue] = useState('');

  const value = useMemo(
    () => ({ searchValue, setSearchValue }),
    [searchValue, setSearchValue],
  );

  return (
    <SearchContext.Provider {...{ value }}>{children}</SearchContext.Provider>
  );
};

export default SearchContextProvider;
