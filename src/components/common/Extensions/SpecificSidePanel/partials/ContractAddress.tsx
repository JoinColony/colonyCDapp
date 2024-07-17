import React, { type FC } from 'react';

import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';

import specificSidePanelClasses from '../SpecifcSidePanel.styles.ts';
import { type PanelTypeProps } from '../types.ts';

const displayName = 'common.Extensions.partials.ContractAddress';

const ContractAddress: FC<PanelTypeProps> = ({ title, description }) => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard();

  return (
    <div className={specificSidePanelClasses.panelRow}>
      <p className={specificSidePanelClasses.panelTitle}>{title}</p>
      {description && (
        <Tooltip
          isCopyTooltip
          isSuccess={isCopied}
          isOpen={isCopied}
          tooltipContent={
            <a className="block" href={description}>
              {formatText({ id: isCopied ? 'copied' : 'copy.address' })}
            </a>
          }
        >
          <button
            type="button"
            aria-label={formatText({ id: 'copy.address' })}
            className="justify-start overflow-hidden text-ellipsis text-md font-normal"
            onClick={() => handleClipboardCopy(description || '')}
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
