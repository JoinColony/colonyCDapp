import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~shared/Preloaders';
import ActionsList from '~shared/ActionsList';
import { useActivityFeed, useColonyContext } from '~hooks';
import Button from '~shared/Button';

import { ActionsListHeading } from '.';

import styles from './ColonyActions.css';
import {
  ActivityDecisionMethod,
  ActivityFeedFilters,
} from '~hooks/useActivityFeed/types';

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

const decisionMethodOptions = [
  {
    label: 'Decision Method',
    value: undefined,
  },
  {
    label: 'Permissions',
    value: ActivityDecisionMethod.Permissions,
  },
  {
    label: 'Reputation',
    value: ActivityDecisionMethod.Reputation,
  },
];

const ColonyActions = (/* { ethDomainId }: Props */) => {
  const { colony } = useColonyContext();

  const [filters, setFilters] = useState<ActivityFeedFilters>({});

  const {
    actions,
    loading,
    loadingNextPage,
    sortDirection,
    changeSortDirection,
    hasNextPage,
    goToNextPage,
    goToPreviousPage,
    pageNumber,
  } = useActivityFeed(filters);

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
          <div>
            <select
              value={filters.decisionMethod}
              onChange={(event) => {
                setFilters({
                  ...filters,
                  decisionMethod: event.target.value as
                    | ActivityDecisionMethod
                    | undefined,
                });
              }}
            >
              {decisionMethodOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <ActionsListHeading
            sortDirection={sortDirection}
            onSortChange={changeSortDirection}
          />
          <ActionsList items={actions} />
          <div className={styles.pagination}>
            Page {pageNumber}
            <div>
              {pageNumber > 1 && (
                <Button onClick={goToPreviousPage}>Previous</Button>
              )}
              {hasNextPage && (
                <Button onClick={goToNextPage} loading={loadingNextPage}>
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
