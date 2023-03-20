import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import styles from './NoWhitelistedAddressesState.css';

const displayName = 'common.ManageWhitelistDialog.NoWhitelistedAddressesState';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'The address book is empty.',
  },
  desc: {
    id: `${displayName}.desc`,
    defaultMessage: `Click tab "Add address" to add the first one`,
  },
});

const NoWhitelistedAddressesState = () => {
  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <FormattedMessage {...MSG.title} />
      </div>
      <div className={styles.desc}>
        <FormattedMessage {...MSG.desc} />
      </div>
    </div>
  );
};

NoWhitelistedAddressesState.displayName = displayName;

export default NoWhitelistedAddressesState;
