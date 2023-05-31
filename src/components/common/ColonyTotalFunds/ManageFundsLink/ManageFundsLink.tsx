import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~shared/Extensions/Icon';
import Link from '~shared/Extensions/Link';
import { useColonyContext } from '~hooks';

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
    <Link className={styles.manageFundsLink} to={`/colony/${colony?.name}/funds`} data-test="manageFunds">
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

ManageFundsLink.displayName = displayName;

export default ManageFundsLink;
