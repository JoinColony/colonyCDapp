import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~shared/Preloaders';
import ActionsList from '~shared/ActionsList';
import { useActivityFeed, useColonyContext } from '~hooks';
import { ColonyActionType, SortDirection } from '~types';
import Button from '~shared/Button';

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
    hasNextPage,
    goToNextPage,
    goToPreviousPage,
    pageNumber,
  } = useActivityFeed({
    actionTypes: [ColonyActionType.MintTokens],
  });

  if (!colony) {
    return null;
  }

  if (loading && !actions.length) {
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
          <div className={styles.pagination}>
            Page {pageNumber}
            <div>
              {pageNumber > 1 && (
                <Button onClick={goToPreviousPage} loading={loading}>
                  Previous
                </Button>
              )}
              {hasNextPage && (
                <Button onClick={goToNextPage} loading={loading}>
                  Next
                </Button>
              )}
            </div>
          </div>
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
