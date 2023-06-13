import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import Tooltip from '~shared/Extensions/Tooltip';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';
import { splitWalletAddress } from '~utils/splitWalletAddress';

const displayName = 'common.Extensions.partials.ContractAddress';

const ContractAddress: FC<PanelTypeProps> = ({ title, description }) => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard(
    description || '',
  );
  const { formatMessage } = useIntl();

  return (
    <div className={styles.panelRow}>
      <div className={styles.panelTitle}>{title}</div>
      {description && (
        <Tooltip
          interactive
          isSuccess={isCopied}
          tooltipContent={
            <span>
              <a href={description}>
                {formatMessage({ id: isCopied ? 'copied' : 'copy.address' })}
              </a>
            </span>
          }
        >
          <button
            type="button"
            aria-label={formatMessage({ id: 'copy.address' })}
            className="font-normal text-md text-gray-900 justify-start text-ellipsis overflow-hidden"
            onClick={handleClipboardCopy}
          >
            {splitWalletAddress(description)}
          </button>
        </Tooltip>
      )}
    </div>
  );
};

ContractAddress.displayName = displayName;

export default ContractAddress;
