import React, { FC, useEffect, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { CopyUrlProps } from './NotificationBanner.types';

const displayName = 'common.Extensions.CopyUrl';

const CopyUrl: FC<CopyUrlProps> = ({ actionText }) => {
  const [copied, setCopied] = useState(false);
  const handleClipboardCopy = () => {
    setCopied(true);
    copyToClipboard(actionText);
  };

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <div onClick={handleClipboardCopy} onKeyPress={handleClipboardCopy} role="button" tabIndex={0}>
      {actionText}
    </div>
  );
};

CopyUrl.displayName = displayName;

export default CopyUrl;
