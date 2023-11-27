import React from 'react';

import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import MaskedAddress from '~shared/MaskedAddress';

interface InvisibleCopyableMaskedAddressProps {
  address: string;
}

export const InvisibleCopyableMaskedAddress = ({
  address,
}: InvisibleCopyableMaskedAddressProps) => (
  <InvisibleCopyableAddress address={address}>
    <MaskedAddress address={address} />
  </InvisibleCopyableAddress>
);
