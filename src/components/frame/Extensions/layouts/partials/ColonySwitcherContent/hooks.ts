import { useCallback, useState } from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import useJoinedColonies from '~hooks/useJoinedColonies.ts';

import { type UseColonySwitcherContentReturnType } from './types.ts';

export const useColonySwitcherContent =
  (): UseColonySwitcherContentReturnType => {
    const { wallet } = useAppContext();
    const { joinedColonies, loading } = useJoinedColonies(wallet?.address);

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
      loading,
      filteredColonies,
      searchValue,
      onSearchValueChange: handleSearchValueChange,
    };
  };
