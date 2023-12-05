import { useMemo, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { useAppContext } from '~hooks';
import { notNull } from '~utils/arrays';

import { getChainIconName } from '../../utils';
import { ColonySwitcherListItem } from '../ColonySwitcherList/types';

import { sortByDate } from './utils';
import { UseColonySwitcherContentReturnType } from './types';

export const useColonySwitcherContent = (
  colony,
): UseColonySwitcherContentReturnType => {
  const { userLoading, user } = useAppContext();
  const [searchValue, setSearchValue] = useState('');

  const userColonies = useMemo(
    () => (user?.watchlist?.items.filter(notNull) || []).sort(sortByDate),
    [user],
  );

  const { chainMetadata, colonyAddress, name } = colony || {};
  const { chainId } = chainMetadata || {};

  const chainIcon = getChainIconName(chainId);

  const joinedColonies: ColonySwitcherListItem[] = userColonies.reduce(
    (result, item) => {
      if (!item) {
        return result;
      }

      const { colony: itemColony, id } = item;

      if (colonyAddress === itemColony.colonyAddress) {
        return result;
      }

      return [
        ...result,
        {
          key: id,
          name: itemColony.metadata?.displayName || name || '',
          to: `/${itemColony.name}`,
          avatarProps: {
            chainIconName: getChainIconName(itemColony.chainMetadata.chainId),
            colonyImageProps: itemColony.metadata?.avatar
              ? {
                  src:
                    itemColony.metadata?.thumbnail ||
                    itemColony.metadata?.avatar,
                }
              : undefined,
            colonyAddress: itemColony.colonyAddress,
          },
        },
      ];
    },
    [],
  );

  const handleSearch = useMemo(
    () => debounce(setSearchValue, 500),
    [setSearchValue],
  );

  const onChange = useCallback(
    (value: string) => {
      handleSearch(value);
    },
    [handleSearch],
  );

  const filteredColony = useMemo(
    () =>
      joinedColonies.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [joinedColonies, searchValue],
  );

  return {
    userLoading,
    filteredColony,
    joinedColonies,
    searchValue,
    onChange,
    currentColonyProps: {
      colonyDisplayName: colony?.metadata?.displayName,
      name: colony?.name,
      chainIconName: chainIcon,
    },
  };
};
