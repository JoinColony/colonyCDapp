import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext } from '~hooks';
import { COLONY_INCOMING_ROUTE } from '~routes';
import Icon from '~shared/Icon';
import Link from '~shared/Link';

import styles from './ManageFundsLink.css';

const displayName = 'common.ColonyTotalFunds.ManageFundsLink';

const MSG = defineMessages({
  manageFundsLink: {
    id: `${displayName}.manageFundsLink`,
    defaultMessage: 'Manage Funds',
  },
});

const ManageFundsLink = () => {
  const { colony } = useColonyContext();

  return (
    <Link
      className={styles.manageFundsLink}
      to={`/${colony?.name}/${COLONY_INCOMING_ROUTE}`}
      data-test="manageFunds"
    >
      <Icon
        className={styles.rightArrowDisplay}
        name="arrow-right"
        appearance={{ size: 'extraSmall' }}
        title={MSG.manageFundsLink}
      />
      <FormattedMessage {...MSG.manageFundsLink} />
    </Link>
  );
};

ManageFundsLink.displayName = displayName;

export default ManageFundsLink;
