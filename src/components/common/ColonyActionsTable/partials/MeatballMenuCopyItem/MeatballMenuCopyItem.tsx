import React, { FC, PropsWithChildren } from 'react';

import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';

import { MeatballMenuCopyItemProps } from './types';

const MeatballMenuCopyItem: FC<
  PropsWithChildren<MeatballMenuCopyItemProps>
> = ({ textToCopy, className, children, onClick }) => {
  const { handleClipboardCopy, isCopied } = useCopyToClipboard(textToCopy);

  return (
    <Tooltip
      isSuccess
      tooltipContent={formatText({ id: 'meatBallMenuCopyItem.copySuccess' })}
      isOpen={isCopied}
    >
      <button
        type="button"
        className={className}
        onClick={() => {
          onClick?.();
          handleClipboardCopy();
        }}
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default MeatballMenuCopyItem;
