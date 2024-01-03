import React from 'react';
import { MessageDescriptor } from 'react-intl';

import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import MaskedAddress from '~shared/MaskedAddress';
import { Address as AddressType } from '~types';

import styles from './Address.css';

const displayName = 'Address';

interface AddressProps {
  address: AddressType;
  copyMessage?: MessageDescriptor;
  maskedAddressStyles?: string;
}

const Address = ({
  address,
  copyMessage,
  maskedAddressStyles = styles.address,
}: AddressProps) => (
  <InvisibleCopyableAddress address={address} copyMessage={copyMessage}>
    <span className={maskedAddressStyles}>
      <MaskedAddress address={address} />
    </span>
  </InvisibleCopyableAddress>
);

Address.displayName = displayName;

export default Address;
