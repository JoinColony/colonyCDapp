import React, { useState, useCallback, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import Icon from '~shared/Icon';
import { filterUserSelection, OmniPickerUser } from '~shared/SingleUserPicker';
import { User } from '~types';
import { formatText } from '~utils/intl';

import UserCheckbox from '../UserCheckbox';

import styles from './WhitelistedAddresses.css';

interface Props {
  whitelistedUsers: User[];
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

const WhitelistedAddresses = ({ whitelistedUsers }: Props) => {
  const [users, setUsers] = useState<User[] | Omit<OmniPickerUser, 'name'>[]>(whitelistedUsers);

  useEffect(() => {
    if (whitelistedUsers?.length) {
      setUsers(whitelistedUsers);
    }
  }, [whitelistedUsers]);

  const handleOnChange = useCallback(
    (e) => {
      if (e.target?.value) {
        const formattedWhitelistedUsers = whitelistedUsers.map((user) => ({
          ...user,
          id: user.walletAddress,
        }));
        const [, ...filteredUsers] = filterUserSelection(formattedWhitelistedUsers, e.target?.value);
        setUsers(filteredUsers);
      }
    },
    [whitelistedUsers, setUsers],
  );

  return (
    <div className={styles.main}>
      <div className={styles.searchContainer}>
        <input name="warning" className={styles.input} onChange={handleOnChange} placeholder={formatText(MSG.search)} />
        <Icon className={styles.icon} name="search" title={MSG.search} />
      </div>
      <div className={styles.container}>
        {(users || []).map((user) => {
          return (
            <UserCheckbox
              key={user.walletAddress}
              name="whitelistedAddresses"
              walletAddress={user.walletAddress}
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
