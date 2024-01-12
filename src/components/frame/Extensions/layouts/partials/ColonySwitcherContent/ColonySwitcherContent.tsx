import clsx from 'clsx';
import React, { FC } from 'react';
import { defineMessages } from 'react-intl';

import { SpinnerLoader } from '~shared/Preloaders';
import { formatText } from '~utils/intl';
import EmptyContent from '~v5/common/EmptyContent';
import SearchInput from '~v5/shared/SearchSelect/partials/SearchInput';

import ColonySwitcherItem from '../ColonySwitcherItem';
import ColonySwitcherList from '../ColonySwitcherList';

import { useColonySwitcherContent } from './hooks';
import { ColonySwitcherContentProps } from './types';

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
// The rest of the functionality will be added in the next PRs.
const ColonySwitcherContent: FC<ColonySwitcherContentProps> = ({ colony }) => {
  const {
    currentColonyItem,
    searchValue,
    onSearchValueChange,
    filteredListItems,
    loading,
  } = useColonySwitcherContent(colony);

  const titleClassName = 'uppercase text-4 text-gray-400 mb-1';

  return loading ? (
    <SpinnerLoader />
  ) : (
    <div className="pt-6 w-full flex flex-col gap-4">
      {currentColonyItem && (
        <div>
          <h3 className={titleClassName}>
            {formatText(MSG.currentColonytitle)}
          </h3>
          <ColonySwitcherItem {...currentColonyItem} />
        </div>
      )}
      <div
        className={clsx('flex flex-col gap-6', {
          'pt-6 border-t border-t-gray-200': colony,
        })}
      >
        <SearchInput onChange={onSearchValueChange} value={searchValue} />
        <div>
          <h3 className={titleClassName}>
            {formatText(MSG.joinedColonyTitle)}
          </h3>
          {!!filteredListItems.length && (
            <ColonySwitcherList items={filteredListItems} />
          )}
          {filteredListItems.length === 0 && !searchValue && (
            <EmptyContent
              icon="layout"
              title={MSG.emptyJoinedStateTitle}
              description={MSG.emptyJoinedStateSubtitle}
            />
          )}
          {filteredListItems.length === 0 && searchValue && (
            <EmptyContent
              icon="binoculars"
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
