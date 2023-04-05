import React, { FC } from 'react';
import { CopyUrlProps } from './NotificationBanner.types';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';

const displayName = 'common.Extensions.CopyUrl';

const CopyUrl: FC<CopyUrlProps> = ({ actionText }) => {
  const { handleClipboardCopy } = useCopyToClipboard(actionText);

  return (
    <button onClick={handleClipboardCopy} onKeyPress={handleClipboardCopy} type="button">
      {actionText}
    </button>
  );
};

CopyUrl.displayName = displayName;

export default CopyUrl;
