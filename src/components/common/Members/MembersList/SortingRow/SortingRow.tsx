import React from 'react';
import { defineMessages } from 'react-intl';

import { SortingMethod } from '~gql';

import SortingButton from './SortingButton';

import styles from './SortingRow.css';

export interface Props {
  sortingMethod: SortingMethod;
  handleSortingMethodChange: React.Dispatch<
    React.SetStateAction<SortingMethod>
  >;
}

const displayName = 'MembersList.SortingRow';

const MSG = defineMessages({
  permissions: {
    id: `${displayName}.permissions`,
    defaultMessage: 'Permissions',
  },
  reputation: {
    id: `${displayName}.reputation`,
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
      <SortingButton
        isSortingByRep={isSortingByRep}
        nextSortingMethod={nextSortingByRoleMethod}
        handleSortingMethodChange={handleSortingMethodChange}
        message={MSG.permissions}
        caretUp={sortingMethod === SortingMethod.ByMorePermissions}
      />
      <SortingButton
        isSortingByRep={isSortingByRep}
        nextSortingMethod={nextSortingByRepMethod}
        handleSortingMethodChange={handleSortingMethodChange}
        message={MSG.reputation}
        caretUp={sortingMethod === SortingMethod.ByHighestRep}
      />
    </div>
  );
};

SortingRow.displayName = displayName;

export default SortingRow;
