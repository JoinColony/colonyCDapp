import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~shared/Preloaders';
import LoadMoreButton from '~shared/LoadMoreButton';
import ActionsList from '~shared/ActionsList';
import { useActivityFeed, useColonyContext } from '~hooks';
import { SortDirection } from '~types';

import { ActionsListHeading } from '.';

import styles from './ColonyActions.css';

const displayName = 'common.ColonyActions';

const MSG = defineMessages({
  noActionsFound: {
    id: `${displayName}.noActionsFound`,
    defaultMessage: 'There are no actions yet',
  },
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: `Loading Actions`,
  },
});

// type Props = {
//   ethDomainId?: number;
// };

const ColonyActions = (/* { ethDomainId }: Props */) => {
  const { colony } = useColonyContext();

  // const {
  //   loading,
  //   actions,
  //   sortDirection,
  //   onSortDirectionChange: changeSortDirection,
  //   hasMoreActions,
  //   loadMoreActions,
  // } = usePaginatedActions();

  const {
    actions,
    loading,
    changeSortDirection,
    hasMoreActions,
    loadMoreActions,
    isFetchingMore,
  } = useActivityFeed({
    // actionTypes: [ColonyActionType.MintTokens],
  });

  if (!colony) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.loadingSpinner}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ theme: 'primary', size: 'massive' }}
        />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {actions.length ? (
        <>
          <ActionsListHeading
            sortDirection={SortDirection.Desc}
            onSortChange={changeSortDirection}
          />
          <ActionsList items={actions} />
          {hasMoreActions && (
            <LoadMoreButton
              onClick={loadMoreActions}
              isLoadingData={loading || isFetchingMore} // oneTxActionsLoading || eventsActionsLoading}
            />
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <FormattedMessage {...MSG.noActionsFound} />
        </div>
      )}
    </div>
  );
};

ColonyActions.displayName = displayName;

export default ColonyActions;
