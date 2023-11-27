import React from 'react';

import MaskedAddress from '~shared/MaskedAddress';

import InvisibleCopyableAddress from './InvisibleCopyableAddress';

const displayName = 'InvisibleCopyableMaskedAddress';

interface InvisibleCopyableMaskedAddressProps {
  address: string;
}

const InvisibleCopyableMaskedAddress = ({
  address,
}: InvisibleCopyableMaskedAddressProps) => (
  <InvisibleCopyableAddress address={address}>
    <MaskedAddress address={address} />
  </InvisibleCopyableAddress>
);

InvisibleCopyableMaskedAddress.displayName = displayName;

export default InvisibleCopyableMaskedAddress;
