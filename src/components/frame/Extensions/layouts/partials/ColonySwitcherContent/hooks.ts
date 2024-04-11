import { useCallback, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';

import { type UseColonySwitcherContentReturnType } from './types.ts';

export const useColonySwitcherContent =
  (): UseColonySwitcherContentReturnType => {
    const { joinedColonies, joinedColoniesLoading } = useAppContext();

    const [searchValue, setSearchValue] = useState('');

    const handleSearchValueChange = useCallback((value: string) => {
      setSearchValue(value);
    }, []);

    const filteredColonies = joinedColonies.filter(
      (item) =>
        !searchValue ||
        item.name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return {
      loading: joinedColoniesLoading,
      filteredColonies,
      searchValue,
      onSearchValueChange: handleSearchValueChange,
    };
  };
