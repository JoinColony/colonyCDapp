import React, { useState, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~shared/Icon';
import { Address } from '~types';
import { formatText } from '~utils/intl';

import UserCheckbox from '../UserCheckbox';
import { getFilteredUsers, useWhitelistedUsers } from './helpers';

import styles from './WhitelistedAddresses.css';

interface Props {
  whitelistedAddresses: Address[];
}

const displayName = 'common.ManageWhitelistDialog.WhitelistedAddresses';

const MSG = defineMessages({
  search: {
    id: `${displayName}.search`,
    defaultMessage: 'Search...',
  },
  checkedTooltipText: {
    id: `${displayName}.checkedTooltipText`,
    defaultMessage: `User is added to the address book. Uncheck to remove.`,
  },
  unCheckedTooltipText: {
    id: `${displayName}.unCheckedTooltipText`,
    defaultMessage: `User will be removed from the address book.`,
  },
});

const WhitelistedAddresses = ({ whitelistedAddresses }: Props) => {
  const users = useWhitelistedUsers(whitelistedAddresses);
  const [filterTerm, setFilterTerm] = useState('');

  const filteredUsers = useMemo(
    () => getFilteredUsers(users, filterTerm),
    [filterTerm, users],
  );

  return (
    <div className={styles.main}>
      <div className={styles.searchContainer}>
        <input
          name="warning"
          className={styles.input}
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.currentTarget.value)}
          placeholder={formatText(MSG.search)}
        />
        <Icon className={styles.icon} name="search" title={MSG.search} />
      </div>
      <div className={styles.container}>
        {filteredUsers.map((user) => {
          return (
            <UserCheckbox
              key={user.address}
              name="whitelistedAddresses"
              walletAddress={user.address}
              user={user.user}
              checkedTooltipText={formatText(MSG.checkedTooltipText)}
              unCheckedTooltipText={formatText(MSG.unCheckedTooltipText)}
              showDisplayName={false}
            />
          );
        })}
      </div>
    </div>
  );
};

WhitelistedAddresses.displayName = displayName;

export default WhitelistedAddresses;
