import { useMemo, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

import { useAppContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { useGetContributorsByAddressQuery } from '~gql';

import { getChainIconName } from '../../utils';
import { ColonySwitcherListItem } from '../ColonySwitcherList/types';

export const useColonySwitcherContent = (
  colony,
): UseColonySwitcherContentReturnType => {
  const { userLoading, user } = useAppContext();
  const [searchValue, setSearchValue] = useState('');

  const { data } = useGetContributorsByAddressQuery({
    variables: { contributorAddress: user?.walletAddress || '' },
    skip: !user?.walletAddress,
  });

  const userColonies = (
    data?.getContributorsByAddress?.items.filter(
      (contributor) => notNull(contributor) && contributor?.colony,
    ) || []
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

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
