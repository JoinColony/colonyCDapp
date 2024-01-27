import clsx from 'clsx';
import React from 'react';

import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import Icon from '~shared/Icon/index.ts';
import MaskedAddress from '~shared/MaskedAddress/index.ts';
import { Address } from '~types/index.ts';

interface Props {
  /** Address to display */
  address: Address;
  /** Indicates that the full address should be shown instead of an abbreviated one */
  full?: boolean;
}

const displayName = 'CopyableAddress';

const CopyableAddress = ({ address, full }: Props) => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard();

  return (
    <button
      type="button"
      className={clsx(
        'flex flex-row items-center gap-[0.375rem] text-gray-600 hover:text-blue-400',
        isCopied && 'text-success-400 hover:text-success-400',
      )}
      onClick={() => handleClipboardCopy(address)}
    >
      <MaskedAddress address={address} full={full} />
      {/*
        Note: hexadecimal address has no dangling letters like y,j,g...
        but the 2px system padding is still there at the bottom,
        we offset this by translating the icon 1px higher here so it looks more centered
        */}
      <Icon
        name={isCopied ? 'check-mark' : 'copy-simple'}
        appearance={{ size: 'extraTiny' }}
        className="translate-y-[-1px]"
      />
    </button>
  );
};

CopyableAddress.displayName = displayName;

export default CopyableAddress;
