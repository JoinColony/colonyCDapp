import React, { useCallback } from 'react';
import clsx from 'clsx';
import { splitAddress } from '~utils/strings';

import { Address } from '~types';

import MaskedAddress from '~shared/MaskedAddress';
import useClipboardCopy from '~hooks/useClipboardCopy';
import Icon from '~shared/Icon';
// Note that we use CSS here because MaskedAddress css file will override font-normal by tailwind due to injection order
import styles from './CopyableAddressV2.css';

interface Props {
  /** Address to display */
  children: Address;
  /** Indicates that the full address should be shown instead of an abbreviated one */
  full?: boolean;
  /** In some occasions we want to show the button to copy only */
  hideAddress?: boolean;
}

const displayName = 'CopyableAddressV2';

const CopyableAddressV2 = ({
  children: address,
  full,
  hideAddress = false,
}: Props) => {
  const { isCopied, handleClipboardCopy } = useClipboardCopy(address);

  const getAddress = useCallback(() => {
    const addressElements = splitAddress(address);
    if (full && !(addressElements instanceof Error)) {
      return (
        <MaskedAddress className={styles.address} address={address} full />
      );
    }
    return <MaskedAddress className={styles.address} address={address} />;
  }, [address, full]);

  return (
    <button
      type="button"
      className={clsx(
        'flex flex-row items-center gap-1 hover:text-blue-500',
        isCopied && 'text-green-500 hover:text-green-500',
      )}
      onClick={handleClipboardCopy}
    >
      <span>{!hideAddress && getAddress()}</span>
      <Icon
        name={isCopied ? 'check' : 'copy-simple'}
        appearance={{ size: 'extraTiny' }}
      />
    </button>
  );
};

CopyableAddressV2.displayName = displayName;

export default CopyableAddressV2;
