import React from 'react';
import clsx from 'clsx';

import { Address } from '~types';
import MaskedAddress from '~shared/MaskedAddress';
import useClipboardCopy from '~hooks/useClipboardCopy';
import Icon from '~shared/Icon';

interface Props {
  /** Address to display */
  address: Address;
  /** Indicates that the full address should be shown instead of an abbreviated one */
  full?: boolean;
}

const displayName = 'CopyableAddress';

const CopyableAddress = ({ address, full }: Props) => {
  const { isCopied, handleClipboardCopy } = useClipboardCopy(address);

  return (
    <button
      type="button"
      className={clsx(
        'flex flex-row items-center gap-[0.375rem] text-gray-600 hover:text-blue-400',
        isCopied && 'text-success-400 hover:text-success-400',
      )}
      onClick={handleClipboardCopy}
    >
      <MaskedAddress address={address} full={full} />
      <Icon
        name={isCopied ? 'check-mark' : 'copy-simple'}
        appearance={{ size: 'extraTiny' }}
      />
    </button>
  );
};

CopyableAddress.displayName = displayName;

export default CopyableAddress;
