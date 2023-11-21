import React, { FC } from 'react';
import clsx from 'clsx';
import Button from '~v5/shared/Button';
import { formatText } from '~utils/intl';
import Icon from '~shared/Icon';
import { CopyWalletProps } from './types';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import { useMobile } from '~hooks';

const displayName = 'v5.CopyWallet';

const CopyWallet: FC<CopyWalletProps> = ({
  disabled = false,
  handleClipboardCopy,
  value,
  isCopied,
  ...rest
}) => {
  const isMobile = useMobile();

  return (
    <div className="bg-gray-50 rounded p-3 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon name="cardholder" appearance={{ size: 'extraSmall' }} />
        <span className="text-md">
          {isMobile ? splitWalletAddress(value) : value}
        </span>
      </div>
      {isCopied ? (
        <Button
          mode="completed"
          text={formatText({ id: 'copy.addressCopied' })}
          className="font-medium"
        />
      ) : (
        <Button
          onClick={handleClipboardCopy}
          onKeyDown={handleClipboardCopy}
          disabled={disabled}
          isFullSize
          mode="primaryOutlineFull"
          iconName="copy-simple"
          className={clsx(
            'flex items-center transition-all duration-normal text-sm !border-gray-300 md:hover:text-blue-400',
            {
              'pointer-events-none text-gray-300': disabled,
              'text-gray-700 text-1': !disabled,
            },
          )}
          {...rest}
        >
          {formatText({ id: 'copyWalletAddress' })}
        </Button>
      )}
    </div>
  );
};

CopyWallet.displayName = displayName;

export default CopyWallet;
