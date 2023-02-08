import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext } from '~hooks';
import Link from '~shared/Link';
import SortControls from '~shared/SortControls';
import { SetStateFn, SortDirection } from '~types';

import styles from './ActionsListHeading.css';

const displayName = 'common.ColonyActions.ActionsListHeading';

const MSG = defineMessages({
  actionsTitle: {
    id: `${displayName}.actionsTitle`,
    defaultMessage: 'Actions',
  },
  transactionsLogLink: {
    id: `${displayName}.transactionsLogLink`,
    defaultMessage: 'Transactions log',
  },
});

interface ActionsListHeadingProps {
  sortDirection: SortDirection;
  onSortChange: SetStateFn;
}

const ActionsListHeading = ({
  sortDirection,
  onSortChange,
}: ActionsListHeadingProps) => {
  const { colony } = useColonyContext();
  return (
    <div className={styles.bar}>
      <div className={styles.title}>
        <FormattedMessage {...MSG.actionsTitle} />
      </div>
      <SortControls sortDirection={sortDirection} onChange={onSortChange} />
      <Link
        className={styles.link}
        to={`/colony/${colony?.name}/events`}
        data-test="transactionsLog"
      >
        <FormattedMessage {...MSG.transactionsLogLink} />
      </Link>
    </div>
  );
};

ActionsListHeading.displayName = displayName;

export default ActionsListHeading;
