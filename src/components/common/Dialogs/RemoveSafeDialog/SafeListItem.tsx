import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { SAFE_NETWORKS } from '~constants';
import Avatar from '~shared/Avatar';
import { HookFormCheckbox as Checkbox } from '~shared/Fields';
import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';

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
  safe: any;
  isChecked: boolean;
}

const SafeListItem = ({ safe, isChecked }: Props) => {
  const { formatMessage } = useIntl();
  const safeNetwork = SAFE_NETWORKS.find(
    (network) => network.chainId === Number(safe.chainId),
  );

  return (
    <div className={`${styles.main} ${isChecked && styles.checked}`}>
      <Checkbox
        name="safeList"
        appearance={{ theme: 'pink', direction: 'vertical' }}
        value={safe}
        disabled={false}
        className={styles.checkbox}
      />
      <Avatar
        placeholderIcon="circle-close"
        seed={safe.contractAddress.toLowerCase()}
        title={safe.safeName || safe.contractAddress}
        size="xs"
        className={styles.avatar}
      />

      <span className={`${isChecked ? styles.selectedLabel : styles.label}`}>
        {`${safe.safeName} (${
          safeNetwork?.name || formatMessage(MSG.safeNamePlaceholder)
        })`}
      </span>

      <InvisibleCopyableAddress
        address={safe.contractAddress}
        copyMessage={MSG.copyMessage}
      >
        <div className={styles.address}>
          <MaskedAddress address={safe.contractAddress} />
        </div>
      </InvisibleCopyableAddress>
    </div>
  );
};

export default SafeListItem;
