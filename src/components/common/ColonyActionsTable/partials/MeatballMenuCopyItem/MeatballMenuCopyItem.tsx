import React, { FC, PropsWithChildren } from 'react';

import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';

import { MeatballMenuCopyItemProps } from './types.ts';

const MeatballMenuCopyItem: FC<
  PropsWithChildren<MeatballMenuCopyItemProps>
> = ({ textToCopy, className, children, onClick }) => {
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

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
          handleClipboardCopy(textToCopy);
        }}
      >
        {children}
      </button>
    </Tooltip>
  );
};

export default MeatballMenuCopyItem;
