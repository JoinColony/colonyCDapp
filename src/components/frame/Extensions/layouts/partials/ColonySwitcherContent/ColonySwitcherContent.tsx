import React, { FC, useMemo } from 'react';

import { useAppContext, useColonyContext } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import { formatText } from '~utils/intl';
import { nonNullable } from '~utils/types';

import { getChainIconName } from '../../utils';
import ColonySwitcherItem from '../ColonySwitcherItem';
import ColonySwitcherList from '../ColonySwitcherList';
import { ColonySwitcherListItem } from '../ColonySwitcherList/types';

import { sortByDate } from './utils';

const displayName = 'frame.Extensions.partials.ColonySwitcherContent';

// There's just a base logic added here, so that we can see other colonies and navigate between them.
// The rest of the functionality will be added in the next PRs.
// @todo: sreach, empty list indicator, etc.
const ColonySwitcherContent: FC = () => {
  const { userLoading, user } = useAppContext();
  const { colony } = useColonyContext();

  const userColonies = useMemo(
    () => (user?.watchlist?.items.filter(nonNullable) || []).sort(sortByDate),
    [user],
  );

  const titleClassName = 'uppercase text-4 text-gray-400 mb-3';

  const { name, chainMetadata, metadata, colonyAddress } = colony || {};
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

  const joinedMoreColonies = !!joinedColonies?.length;

  return userLoading ? (
    <SpinnerLoader />
  ) : (
    <div className="pt-6 w-full flex flex-col gap-6">
      {colony && (
        <div>
          <h3 className={titleClassName}>
            {formatText({ id: 'navigation.colonySwitcher.currentColony' })}
          </h3>
          <ColonySwitcherItem
            name={name || ''}
            avatarProps={{
              colonyImageProps: metadata?.avatar
                ? { src: metadata?.thumbnail || metadata?.avatar }
                : undefined,
              chainIconName: chainIcon,
            }}
            to={`/colony/${name}`}
          />
        </div>
      )}
      {joinedMoreColonies && (
        <div className="border-t border-t-gray-200 pt-6 flex flex-col gap-6">
          {/* <div>add search here</div> */}
          <div>
            <h3 className={titleClassName}>
              {formatText({ id: 'navigation.colonySwitcher.joinedColonys' })}
            </h3>
            <ColonySwitcherList items={joinedColonies} />
          </div>
        </div>
      )}
    </div>
  );
};

ColonySwitcherContent.displayName = displayName;

export default ColonySwitcherContent;
