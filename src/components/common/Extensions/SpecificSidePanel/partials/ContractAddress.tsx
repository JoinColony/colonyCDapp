import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import Tooltip from '~shared/Extensions/Tooltip';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';
import { splitWalletAddress } from '~utils/splitWalletAddress';

const displayName = 'common.Extensions.partials.ContractAddress';

const ContractAddress: FC<PanelTypeProps> = ({ title, address }) => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard(address || '');
  const { formatMessage } = useIntl();

  return (
    <div className={styles.panelRow}>
      <p className={styles.panelTitle}>{title}</p>
      {address && (
        <Tooltip
          interactive
          isSuccess={isCopied}
          tooltipContent={
            <a className="block" href={address}>
              {formatMessage({ id: isCopied ? 'copied' : 'copy.address' })}
            </a>
          }
        >
          <button
            type="button"
            aria-label={formatMessage({ id: 'copy.address' })}
            className="font-normal text-md justify-start text-ellipsis overflow-hidden"
            onClick={handleClipboardCopy}
          >
            {splitWalletAddress(address)}
          </button>
        </Tooltip>
      )}
    </div>
  );
};

ContractAddress.displayName = displayName;

export default ContractAddress;
