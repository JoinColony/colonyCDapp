import { Binoculars, Layout } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { getChainIcon } from '~frame/Extensions/layouts/utils.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import SearchInput from '~v5/shared/SearchSelect/partials/SearchInput/index.ts';

import ColonySwitcherItem from '../ColonySwitcherItem/index.ts';

import { useColonySwitcherContent } from './hooks.ts';
import { type ColonySwitcherContentProps } from './types.ts';

const displayName = 'frame.Extensions.partials.ColonySwitcherContent';

const MSG = defineMessages({
  currentColonytitle: {
    id: `${displayName}.title`,
    defaultMessage: 'Current colony',
  },
  joinedColonyTitle: {
    id: `${displayName}.joinedColonyTitle`,
    defaultMessage: 'Joined colonies',
  },
  emptyFilteredStateTitle: {
    id: `${displayName}.emptyFilteredStateTitle`,
    defaultMessage: 'No results to display',
  },
  emptyFilteredStateSubtitle: {
    id: `${displayName}.emptyFilteredStateSubtitle`,
    defaultMessage:
      "There are no Colony's that match your search. Try searching again",
  },
  emptyJoinedStateTitle: {
    id: `${displayName}.emptyJoinedStateTitle`,
    defaultMessage: 'No Colonies joined',
  },
  emptyJoinedStateSubtitle: {
    id: `${displayName}.emptyJoinedStateSubtitle`,
    defaultMessage: 'Once you join or create a Colony, they will appear here.',
  },
});

// There's just a base logic added here, so that we can see other colonies and navigate between them.

const ColonySwitcherContent: FC<ColonySwitcherContentProps> = ({ colony }) => {
  const { searchValue, onSearchValueChange, filteredColonies, loading } =
    useColonySwitcherContent();

  const titleClassName = 'uppercase text-4 text-gray-400 mb-1';

  if (loading) {
    return <SpinnerLoader />;
  }

  return (
    <div className="flex w-full flex-col gap-4 md:pt-6">
      {colony && (
        <div>
          <h3 className={titleClassName}>
            {formatText(MSG.currentColonytitle)}
          </h3>
          <ColonySwitcherItem
            colonyAddress={colony.colonyAddress}
            link={`/${colony.name}`}
            name={colony.metadata?.displayName || colony.name}
            ChainIcon={getChainIcon(colony.chainMetadata.chainId)}
            avatarSrc={
              colony.metadata?.avatar
                ? colony.metadata?.thumbnail || colony.metadata?.avatar
                : undefined
            }
          />
        </div>
      )}
      <div
        className={clsx('flex flex-col gap-6', {
          'border-t border-t-gray-200 pt-6': colony,
        })}
      >
        <SearchInput onChange={onSearchValueChange} value={searchValue} />
        <div>
          <h3 className={titleClassName}>
            {formatText(MSG.joinedColonyTitle)}
          </h3>
          {!!filteredColonies.length && (
            <ul className="flex w-full flex-col gap-2">
              {filteredColonies.map((filteredColony) => {
                return (
                  <li key={filteredColony.colonyAddress}>
                    <ColonySwitcherItem
                      colonyAddress={filteredColony.colonyAddress}
                      link={`/${filteredColony.name}`}
                      name={
                        filteredColony.metadata?.displayName ||
                        filteredColony.name
                      }
                      ChainIcon={getChainIcon(
                        filteredColony.chainMetadata.chainId,
                      )}
                      avatarSrc={
                        filteredColony.metadata?.avatar
                          ? filteredColony.metadata?.thumbnail ||
                            filteredColony.metadata?.avatar
                          : undefined
                      }
                    />
                  </li>
                );
              })}
            </ul>
          )}
          {filteredColonies.length === 0 && !searchValue && (
            <EmptyContent
              icon={Layout}
              title={MSG.emptyJoinedStateTitle}
              description={MSG.emptyJoinedStateSubtitle}
            />
          )}
          {filteredColonies.length === 0 && searchValue && (
            <EmptyContent
              icon={Binoculars}
              title={MSG.emptyFilteredStateTitle}
              description={MSG.emptyFilteredStateSubtitle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ColonySwitcherContent.displayName = displayName;

export default ColonySwitcherContent;
