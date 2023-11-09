import React, { FC } from 'react';
import clsx from 'clsx';

import { SpinnerLoader } from '~shared/Preloaders';
import { formatText } from '~utils/intl';

import ColonySwitcherItem from '../ColonySwitcherItem';
import ColonySwitcherList from '../ColonySwitcherList';

import SearchInput from '~v5/shared/SearchSelect/partials/SearchInput';
import EmptyContent from '~v5/common/EmptyContent';
import { useColonySwitcherContent } from './hooks';
import { ColonySwitcherContentProps } from './types';

const displayName = 'frame.Extensions.partials.ColonySwitcherContent';

// There's just a base logic added here, so that we can see other colonies and navigate between them.
// The rest of the functionality will be added in the next PRs.
const ColonySwitcherContent: FC<ColonySwitcherContentProps> = ({ colony }) => {
  const {
    userLoading,
    filteredColony,
    name,
    chainIcon,
    onInput,
    joinedColonies,
    searchValue,
  } = useColonySwitcherContent();

  const titleClassName = 'uppercase text-4 text-gray-400 mb-3';

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
              colonyImageProps: colony?.metadata?.avatar
                ? {
                    src:
                      colony?.metadata?.thumbnail || colony?.metadata?.avatar,
                  }
                : undefined,
              chainIconName: chainIcon,
            }}
            to={`/colony/${name}`}
          />
        </div>
      )}
      {joinedMoreColonies && (
        <div className="border-t border-t-gray-200 pt-6 flex flex-col gap-6">
          <SearchInput
            onInput={onInput}
            className={clsx({
              'text-gray-900': searchValue.length,
              'text-gray-400': !searchValue.length,
            })}
          />
          <div>
            <h3 className={titleClassName}>
              {formatText({ id: 'navigation.colonySwitcher.joinedColonys' })}
            </h3>
            <ColonySwitcherList
              items={searchValue ? filteredColony : joinedColonies}
            />
            {!filteredColony.length && (
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
