import {
  useMemo,
  useCallback,
  ChangeEventHandler,
  ChangeEvent,
  useState,
  useEffect,
} from 'react';

import debounce from 'lodash/debounce';
import { useAppContext, useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';

import { getChainIconName } from '../../utils';
import { ColonySwitcherListItem } from '../ColonySwitcherList/types';

import { sortByDate } from './utils';
import { UseColonySwitcherContentReturnType } from './types';

export const useColonySwitcherContent =
  (): UseColonySwitcherContentReturnType => {
    const { userLoading, user } = useAppContext();
    const { colony } = useColonyContext();
    const [searchValue, setSearchValue] = useState('');
    const [filteredColony, setFilteredColony] = useState<
      ColonySwitcherListItem[]
    >([]);

    const userColonies = useMemo(
      () => (user?.watchlist?.items.filter(notNull) || []).sort(sortByDate),
      [user],
    );

    const { name, chainMetadata, colonyAddress } = colony || {};
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
            name: itemColony.name,
            to: `/colony/${itemColony.name}`,
            avatarProps: {
              chainIconName: getChainIconName(itemColony.chainMetadata.chainId),
              colonyImageProps: itemColony.metadata?.avatar
                ? {
                    src:
                      itemColony.metadata?.thumbnail ||
                      itemColony.metadata?.avatar,
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

    const onInput: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { value: inputValue } = e.target;
        handleSearch(inputValue);
      },
      [handleSearch],
    );

    useEffect(() => {
      setFilteredColony(
        joinedColonies.filter((item) => item.name.includes(searchValue)),
      );
    }, [setFilteredColony, joinedColonies, searchValue]);

    return {
      userLoading,
      filteredColony,
      name,
      chainIcon,
      joinedColonies,
      searchValue,
      onInput,
    };
  };
