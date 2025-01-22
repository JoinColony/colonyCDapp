import React from 'react';

import MaskedAddress from '~shared/MaskedAddress/index.ts';
import { isAddress } from '~utils/web3/index.ts';

export const SearchItemLabelText = ({ labelText }: { labelText: string }) => {
  const lowerCasedLabelText = labelText.toLowerCase();

  return isAddress(lowerCasedLabelText) ? (
    <MaskedAddress address={lowerCasedLabelText} />
  ) : (
    <>{labelText}</>
  );
};
