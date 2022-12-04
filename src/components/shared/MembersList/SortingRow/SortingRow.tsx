import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import Button from '~shared/Button';
import Icon from '~shared/Icon';

import { SortingMethod } from '~gql';

import styles from './SortingRow.css';

interface Props {
  sortingMethod: SortingMethod;
  handleSortingMethodChange: React.Dispatch<
    React.SetStateAction<SortingMethod>
  >;
}

const displayName = 'dashboard.MembersList.SortingRow';

const MSG = defineMessages({
  permissions: {
    id: 'dashboard.MembersList.SortingRow.permissions',
    defaultMessage: 'Permissions',
  },
  reputation: {
    id: 'dashboard.MembersList.SortingRow.reputation',
    defaultMessage: 'Reputation',
  },
});

const SortingRow = ({ handleSortingMethodChange, sortingMethod }: Props) => {
  const nextSortingByRepMethod =
    sortingMethod === SortingMethod.ByHighestRep
      ? SortingMethod.ByLowestRep
      : SortingMethod.ByHighestRep;
  const nextSortingByRoleMethod =
    sortingMethod === SortingMethod.ByMorePermissions
      ? SortingMethod.ByLessPermissions
      : SortingMethod.ByMorePermissions;
  const isSortingByRep =
    sortingMethod === SortingMethod.ByHighestRep ||
    sortingMethod === SortingMethod.ByLowestRep;
  return (
    <div className={styles.container}>
      <Button
        className={styles.sortingButton}
        onClick={() => handleSortingMethodChange(nextSortingByRoleMethod)}
      >
        <FormattedMessage {...MSG.permissions} />
        <Icon
          className={classnames(styles.sortingIcon, {
            [styles.toggledIcon]: !isSortingByRep,
          })}
          name={
            sortingMethod === SortingMethod.ByMorePermissions
              ? 'caret-up'
              : 'caret-down'
          }
          title={MSG.permissions}
        />
      </Button>
      <Button
        className={styles.sortingButton}
        onClick={() => handleSortingMethodChange(nextSortingByRepMethod)}
      >
        <FormattedMessage {...MSG.reputation} />
        <Icon
          className={classnames(styles.sortingIcon, {
            [styles.toggledIcon]: isSortingByRep,
          })}
          name={
            sortingMethod === SortingMethod.ByHighestRep
              ? 'caret-up'
              : 'caret-down'
          }
          title={MSG.reputation}
        />
      </Button>
    </div>
  );
};

SortingRow.displayName = displayName;

export default SortingRow;
