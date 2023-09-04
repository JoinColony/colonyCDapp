import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import classnames from 'classnames';

import { SUPPORTED_SAFE_NETWORKS } from '~constants';
import Avatar from '~shared/Avatar';
import { Checkbox } from '~shared/Fields';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import { Safe } from '~types';

import styles from './SafeListItem.css';

const displayName = 'common.RemoveSafeDialog.SafeListItem';

const MSG = defineMessages({
  copyMessage: {
    id: `${displayName}.copyMessage`,
    defaultMessage: 'Click to copy Safe address',
  },
  safeNamePlaceholder: {
    id: `${displayName}.safeNamePlaceholder`,
    defaultMessage: 'Unknown',
  },
});

interface Props {
  safe: Safe;
  isChecked: boolean;
}

const SafeListItem = ({ safe, isChecked }: Props) => {
  const { formatMessage } = useIntl();
  const safeNetwork = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.chainId === safe.chainId,
  );
  return (
    <div className={classnames(styles.main, { [styles.checked]: isChecked })}>
      <Checkbox
        name="safes"
        appearance={{ theme: 'pink', direction: 'vertical' }}
        value={JSON.stringify(safe)}
        disabled={false}
        className={styles.checkbox}
      />
      <Avatar
        placeholderIcon="circle-close"
        seed={safe.address.toLowerCase()}
        title={safe.name || safe.address}
        size="xs"
        className={styles.avatar}
      />

      <span
        className={classnames(styles.label, {
          [styles.selectedLabel]: isChecked,
        })}
      >
        {`${safe.name} (${
          safeNetwork?.name || formatMessage(MSG.safeNamePlaceholder)
        })`}
      </span>

      <InvisibleCopyableAddress
        address={safe.address}
        copyMessage={MSG.copyMessage}
      >
        <div className={styles.address}>
          <MaskedAddress address={safe.address} />
        </div>
      </InvisibleCopyableAddress>
    </div>
  );
};

export default SafeListItem;
