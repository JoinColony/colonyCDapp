import React from 'react';
import { MessageDescriptor } from 'react-intl';

import { Address } from '~types';

import MaskedAddress from '~shared/MaskedAddress';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';

import styles from './InvisibleCopyableMaskedAddress.css';

const displayName = 'InvisibleCopyableMaskedAddress';

interface InvisibleCopyableMaskedAddressProps {
  address: Address;
  copyMessage?: MessageDescriptor;
  maskedAddressStyles?: string;
}

const InvisibleCopyableMaskedAddress = ({
  address,
  copyMessage,
  maskedAddressStyles = styles.address,
}: InvisibleCopyableMaskedAddressProps) => (
  <InvisibleCopyableAddress address={address} copyMessage={copyMessage}>
    <span className={maskedAddressStyles}>
      <MaskedAddress address={address} />
    </span>
  </InvisibleCopyableAddress>
);

InvisibleCopyableMaskedAddress.displayName = displayName;

export default InvisibleCopyableMaskedAddress;
