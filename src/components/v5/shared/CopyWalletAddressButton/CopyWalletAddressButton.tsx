import { CopySimple } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks/index.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';

import { type CopyWalletAddressButtonProps } from './types.ts';

const displayName = 'v5.CopyWalletAddressButton';

const CopyWalletAddressButton: FC<CopyWalletAddressButtonProps> = ({
  disabled = false,
  handleClipboardCopy,
  walletAddress,
  isCopied,
  ...rest
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  return isCopied ? (
    <p className="text-sm">
      {walletAddress && splitWalletAddress(walletAddress)}
    </p>
  ) : (
    <button
      onClick={handleClipboardCopy}
      onKeyDown={handleClipboardCopy}
      type="button"
      aria-label={formatMessage({ id: 'copyWalletAddress' })}
      disabled={disabled}
      className={clsx(
        'flex items-center transition-all duration-normal hover:text-blue-400',
        isMobile
          ? `border border-gray-100 rounded-[0.1875rem] w-full px-1.5 py-1 justify-center text-gray-700 text-xs mt-1.5`
          : 'text-sm text-gray-600',
        {
          'pointer-events-none text-gray-300': disabled,
        },
      )}
      {...rest}
    >
      <span
        className={clsx(
          'flex items-center',
          isMobile ? 'flex-row-reverse' : 'flex',
        )}
      >
        <span>
          {isMobile
            ? formatMessage({ id: 'copyWalletAddress' })
            : splitWalletAddress(walletAddress || '')}
        </span>
        <span className={clsx('flex shrink-0', isMobile ? 'mr-1.5' : 'ml-1.5')}>
          <CopySimple size={12} />
        </span>
      </span>
    </button>
  );
};

CopyWalletAddressButton.displayName = displayName;

export default CopyWalletAddressButton;
