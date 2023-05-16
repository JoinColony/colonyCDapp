import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import Tooltip from '~shared/Extensions/Tooltip';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.ContractAddress';

const ContractAddress: FC<PanelTypeProps> = ({ title, address }) => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard(address || '');
  const { formatMessage } = useIntl();

  return (
    <div className={styles.panelRow}>
      <div className={styles.panelTitle}>{title}</div>
      <Tooltip
        isSuccess={isCopied}
        tooltipContent={
          <span>
            <a href={address}>{formatMessage({ id: isCopied ? 'copied' : 'copy.address' })}</a>
          </span>
        }
      >
        <button
          type="button"
          aria-label={formatMessage({ id: 'copy.address' })}
          className="font-normal text-md text-gray-90 justify-start"
          onClick={handleClipboardCopy}
        >
          {address}
        </button>
      </Tooltip>
    </div>
  );
};

ContractAddress.displayName = displayName;

export default ContractAddress;
