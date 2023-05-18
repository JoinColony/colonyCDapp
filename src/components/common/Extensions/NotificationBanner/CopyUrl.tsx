import React, { FC } from 'react';
import { CopyUrlProps } from './types';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';

const displayName = 'common.Extensions.CopyUrl';

const CopyUrl: FC<CopyUrlProps> = ({ actionText }) => {
  const { handleClipboardCopy } = useCopyToClipboard(actionText);

  return (
    <button className="text-gray-900" onClick={handleClipboardCopy} onKeyPress={handleClipboardCopy} type="button">
      {actionText}
    </button>
  );
};

CopyUrl.displayName = displayName;

export default CopyUrl;
