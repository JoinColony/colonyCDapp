import React, { useMemo, useState } from 'react';
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
import { MotionState } from '~utils/colonyMotions';
import {
  SearchableColonyActionSortableFields,
  SearchableSortDirection,
} from '~gql';

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
    value: '',
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

const motionStateOptions = [
  {
    label: 'Status',
    value: '',
  },
  {
    label: 'Forced',
    value: MotionState.Forced,
  },
  {
    label: 'Staking',
    value: MotionState.Staking,
  },
  {
    label: 'Supported',
    value: MotionState.Supported,
  },
  {
    label: 'Passed',
    value: MotionState.Passed,
  },
  {
    label: 'Failed',
    value: MotionState.Failed,
  },
];

const ColonyActions = (/* { ethDomainId }: Props */) => {
  const { colony } = useColonyContext();

  const [filters, setFilters] = useState<ActivityFeedFilters>({});
  const [sortDirection, setSortDirection] = useState<SearchableSortDirection>(
    SearchableSortDirection.Desc,
  );

  const {
    actions,
    loadingFirstPage,
    loadingNextPage,
    hasNextPage,
    goToNextPage,
    goToPreviousPage,
    pageNumber,
  } = useActivityFeed(
    filters,
    useMemo(
      () => ({
        direction: sortDirection,
        field: SearchableColonyActionSortableFields.CreatedAt,
      }),
      [sortDirection],
    ),
  );

  if (!colony) {
    return null;
  }

  if (loadingFirstPage) {
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
      <div>
        <select
          value={filters.decisionMethod}
          onChange={(event) => {
            setFilters({
              ...filters,
              decisionMethod: event.target.value
                ? (event.target.value as ActivityDecisionMethod)
                : undefined,
            });
          }}
        >
          {decisionMethodOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={filters.motionStates?.[0]}
          onChange={(event) => {
            setFilters({
              ...filters,
              motionStates: event.target.value
                ? [event.target.value as MotionState]
                : undefined,
            });
          }}
        >
          {motionStateOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {actions.length ? (
        <>
          <ActionsListHeading
            sortDirection={sortDirection}
            onSortChange={setSortDirection}
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
