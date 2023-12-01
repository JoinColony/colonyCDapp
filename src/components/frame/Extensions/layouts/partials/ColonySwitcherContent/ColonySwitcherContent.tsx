import React, { FC } from 'react';
import clsx from 'clsx';

import { SpinnerLoader } from '~shared/Preloaders';
import { formatText } from '~utils/intl';
import SearchInput from '~v5/shared/SearchSelect/partials/SearchInput';
import EmptyContent from '~v5/common/EmptyContent';
import { useColonyContext } from '~hooks';

import ColonySwitcherItem from '../ColonySwitcherItem';
import ColonySwitcherList from '../ColonySwitcherList';

import { useColonySwitcherContent } from './hooks';

const displayName = 'frame.Extensions.partials.ColonySwitcherContent';

// There's just a base logic added here, so that we can see other colonies and navigate between them.
// The rest of the functionality will be added in the next PRs.
const ColonySwitcherContent: FC = () => {
  const { colony } = useColonyContext();

  const {
    userLoading,
    filteredColony,
    currentColonyProps: { name, colonyDisplayName, chainIconName },
    onChange,
    joinedColonies,
    searchValue,
  } = useColonySwitcherContent();

  const titleClassName = 'uppercase text-4 text-gray-400 mb-1';

  const joinedMoreColonies = !!joinedColonies?.length;

  return userLoading ? (
    <SpinnerLoader />
  ) : (
    <div className="pt-6 w-full flex flex-col gap-4">
      {colony && (
        <div>
          <h3 className={titleClassName}>
            {formatText({ id: 'navigation.colonySwitcher.currentColony' })}
          </h3>
          <ColonySwitcherItem
            name={colonyDisplayName || ''}
            avatarProps={{
              colonyImageProps: colony?.metadata?.avatar
                ? {
                    src:
                      colony?.metadata?.thumbnail || colony?.metadata?.avatar,
                  }
                : undefined,
              chainIconName,
              colonyAddress: colony.colonyAddress,
            }}
            to={`/${name}`}
          />
        </div>
      )}
      {joinedMoreColonies && (
        <div
          className={clsx('flex flex-col gap-6', {
            'pt-6 border-t border-t-gray-200': colony,
          })}
        >
          <SearchInput onChange={onChange} />
          <div>
            <h3 className={titleClassName}>
              {formatText({ id: 'navigation.colonySwitcher.heading' })}
            </h3>
            {(filteredColony.length || joinedColonies.length) && (
              <ColonySwitcherList
                items={searchValue ? filteredColony : joinedColonies}
              />
            )}
            {filteredColony.length === 0 && searchValue && (
              <EmptyContent
                icon="binoculars"
                title={{ id: 'colony.emptyState.title' }}
                description={{ id: 'colony.emptyState.subtitle' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ColonySwitcherContent.displayName = displayName;

export default ColonySwitcherContent;
