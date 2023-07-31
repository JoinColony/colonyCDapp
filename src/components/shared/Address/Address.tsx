import React from 'react';
import { MessageDescriptor } from 'react-intl';

import { Address as AddressType } from '~types';

import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';

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
