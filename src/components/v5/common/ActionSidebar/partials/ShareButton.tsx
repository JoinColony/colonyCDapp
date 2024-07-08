import { ShareNetwork } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';

const displayName = 'ActionSidebar.ShareButton';

const ShareButton: FC = () => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard();

  return (
    <Tooltip
      tooltipContent={formatText({ id: 'copy.urlCopied' })}
      isOpen={isCopied}
      isSuccess={isCopied}
      placement="bottom"
    >
      <button
        type="button"
        className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
        onClick={() => handleClipboardCopy(window.location.href)}
        aria-label={formatText({ id: 'ariaLabel.shareAction' })}
      >
        <ShareNetwork size={18} />
      </button>
    </Tooltip>
  );
};

ShareButton.displayName = displayName;

export default ShareButton;
