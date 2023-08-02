import React from 'react';
import { isAddress } from 'ethers/lib/utils';

import MaskedAddress from '~shared/MaskedAddress';
import Avatar from '~shared/Avatar';
import { User } from '~types';
import { InvisibleCopyableMaskedAddress } from '~shared/DetailsWidget/SafeTransactionDetail/components/InvisibleCopyableMaskedAddress';

import styles from './AddressDetailsView.css';

interface Props {
  item: User;
  isSafeItem: boolean;
  isCopyable?: boolean;
}

const AddressDetailsView = ({ item, isSafeItem, isCopyable }: Props) => {
  const userDisplayName = isAddress(item.profile?.displayName || '')
    ? /*
       * If address entered manually, e.g. in raw transaction
       * or if you wish to transfer funds to someone outside the colony
       */
      'Address'
    : item.profile?.displayName;
  const username = item.name;

  const Address = isCopyable ? InvisibleCopyableMaskedAddress : MaskedAddress;
  return (
    <div className={styles.main}>
      <Avatar
        seed={item.walletAddress.toLowerCase()}
        size="xs"
        title="avatar"
        placeholderIcon={isSafeItem ? 'safe-logo' : 'circle-person'}
        className={styles.avatar}
      />
      <span className={styles.name}>{userDisplayName || `@${username}`}</span>
      <Address address={item.walletAddress} />
    </div>
  );
};

export default AddressDetailsView;
