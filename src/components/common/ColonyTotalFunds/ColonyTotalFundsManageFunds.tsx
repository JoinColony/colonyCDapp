import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~shared/Icon';
import Link from '~shared/Link';
import { useColonyContext } from '~hooks';

import styles from './ColonyTotalFunds.css';

const MSG = defineMessages({
  manageFundsLink: {
    id: 'dashboard.ColonyTotalFundsManageFunds.manageFundsLink',
    defaultMessage: 'Manage Funds',
  },
});

const displayName = 'common.ColonyTotalFunds.ColonyTotalFundsManageFunds';

const ColonyTotalFundsManageFunds = () => {
  const { colony } = useColonyContext();

  return (
    <Link
      className={styles.manageFundsLink}
      to={`/colony/${colony?.name}/funds`}
      data-test="manageFunds"
    >
      <Icon
        className={styles.rightArrowDisplay}
        name="arrow-right"
        appearance={{ size: 'small' }}
        title={MSG.manageFundsLink}
      />
      <FormattedMessage {...MSG.manageFundsLink} />
    </Link>
  );
};

ColonyTotalFundsManageFunds.displayName = displayName;

export default ColonyTotalFundsManageFunds;
