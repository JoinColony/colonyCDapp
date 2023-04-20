import React, { FC } from 'react';
import { CopyUrlProps } from './NotificationBanner.types';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';

const displayName = 'common.Extensions.CopyUrl';

const CopyUrl: FC<CopyUrlProps> = ({ actionText }) => {
  const { handleClipboardCopy } = useCopyToClipboard(actionText);

  return (
    <div onClick={handleClipboardCopy} onKeyPress={handleClipboardCopy} role="button" tabIndex={0}>
      {actionText}
    </div>
  );
};

CopyUrl.displayName = displayName;

export default CopyUrl;
