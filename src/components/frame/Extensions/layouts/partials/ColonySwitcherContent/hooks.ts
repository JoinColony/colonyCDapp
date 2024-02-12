import { useCallback, useState } from 'react';

import { useAppContext } from '~context/AppContext.tsx';
import useJoinedColonies from '~hooks/useJoinedColonies.ts';
import { type Colony, type JoinedColony } from '~types/graphql.ts';

import { getChainIcon } from '../../utils.ts';
import { type ColonySwitcherListItem } from '../ColonySwitcherList/types.ts';

import { type UseColonySwitcherContentReturnType } from './types.ts';

const getColonySwitcherListItem = (
  colony: Colony | JoinedColony,
): ColonySwitcherListItem => ({
  key: colony.colonyAddress,
  name: colony.metadata?.displayName || colony.name,
  to: `/${colony.name}`,
  avatarProps: {
    chainIcon: getChainIcon(colony.chainMetadata.chainId),
    colonyImageProps: colony.metadata?.avatar
      ? {
          src: colony.metadata?.thumbnail || colony.metadata?.avatar,
        }
      : undefined,
    colonyAddress: colony.colonyAddress,
  },
});

export const useColonySwitcherContent = (
  colony: Colony | undefined,
): UseColonySwitcherContentReturnType => {
  const { wallet } = useAppContext();
  const { joinedColonies, loading } = useJoinedColonies(wallet?.address);

  const [searchValue, setSearchValue] = useState('');

  const handleSearchValueChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const currentColonyItem = colony && getColonySwitcherListItem(colony);

  const listItems: ColonySwitcherListItem[] = joinedColonies
    .filter(
      (joinedColony) => joinedColony?.colonyAddress !== colony?.colonyAddress,
    )
    .map(getColonySwitcherListItem);

  const filteredListItems = listItems.filter(
    (item) =>
      !searchValue ||
      item.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return {
    loading,
    filteredListItems,
    searchValue,
    onSearchValueChange: handleSearchValueChange,
    currentColonyItem,
  };
};
