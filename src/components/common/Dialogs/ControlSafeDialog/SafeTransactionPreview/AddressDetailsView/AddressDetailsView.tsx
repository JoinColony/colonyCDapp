import React from 'react';

import { isAddress } from '~utils/web3';
import MaskedAddress from '~shared/MaskedAddress';
import Avatar from '~shared/Avatar';
import { User } from '~types';

import styles from './AddressDetailsView.css';
import { ADDRESS_ZERO } from '~constants';

interface Props {
  item: User | undefined;
  isSafeItem: boolean;
}

const AddressDetailsView = ({ item, isSafeItem }: Props) => {
  const userDisplayName = isAddress(item?.profile?.displayName || '')
    ? /*
       * If address entered manually, e.g. in raw transaction
       * or if you wish to transfer funds to someone outside the colony
       */
      'Address'
    : item?.profile?.displayName;

  return (
    <div className={styles.main}>
      <Avatar
        seed={item?.walletAddress.toLowerCase()}
        size="xs"
        title="avatar"
        placeholderIcon={isSafeItem ? 'safe-logo' : 'circle-person'}
        className={styles.avatar}
      />
      <span className={styles.name}>{userDisplayName}</span>
      <MaskedAddress address={item?.walletAddress || ADDRESS_ZERO} />
    </div>
  );
};

export default AddressDetailsView;
