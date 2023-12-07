import { useCallback, useState } from 'react';

import { Colony, JoinedColony } from '~types';
import { useAppContext, useJoinedColonies } from '~hooks';

import { getChainIconName } from '../../utils';
import { ColonySwitcherListItem } from '../ColonySwitcherList/types';
import { UseColonySwitcherContentReturnType } from './types';

const getColonySwitcherListItem = (
  colony: Colony | JoinedColony,
): ColonySwitcherListItem => ({
  key: colony.colonyAddress,
  name: colony.metadata?.displayName || colony.name,
  to: `/${colony.name}`,
  avatarProps: {
    chainIconName: getChainIconName(colony.chainMetadata.chainId),
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
      (joinedColony) => joinedColony.colonyAddress !== colony?.colonyAddress,
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
