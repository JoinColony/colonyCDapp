import { useMemo, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

import { Colony } from '~types';
import { useAppContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { useGetContributorsByAddressQuery } from '~gql';

import { getChainIconName } from '../../utils';
import { ColonySwitcherListItem } from '../ColonySwitcherList/types';

import { UseColonySwitcherContentReturnType } from './types';

export const useColonySwitcherContent = (
  colony: Colony | undefined,
): UseColonySwitcherContentReturnType => {
  const { userLoading, userColonies } = useAppContext();

    const { chainMetadata, colonyAddress, name } = colony || {};
    const { chainId } = chainMetadata || {};

    const [searchValue, setSearchValue] = useState('');

    const chainIcon = getChainIconName(chainId);

  const joinedColonies: ColonySwitcherListItem[] = userColonies.reduce(
    (result, item) => {
      if (colonyAddress === item.colonyAddress) {
        return result;
      }

      return [
        ...result,
        {
          key: item.colonyAddress,
          name: item.metadata?.displayName || name || '',
          to: `/${item.name}`,
          avatarProps: {
            chainIconName: getChainIconName(item.chainMetadata.chainId),
            colonyImageProps: item.metadata?.avatar
              ? {
                  src: item.metadata?.thumbnail || item.metadata?.avatar,
                }
              : undefined,
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
