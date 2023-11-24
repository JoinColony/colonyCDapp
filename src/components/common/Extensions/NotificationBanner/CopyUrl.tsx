import React, { FC } from 'react';

import { useCopyToClipboard } from '~hooks/useCopyToClipboard';

import { CopyUrlProps } from './types';

const displayName = 'common.Extensions.CopyUrl';

const CopyUrl: FC<CopyUrlProps> = ({ actionText }) => {
  const { handleClipboardCopy } = useCopyToClipboard();

  return (
    <button
      onClick={() => handleClipboardCopy(actionText)}
      onKeyPress={() => handleClipboardCopy(actionText)}
      type="button"
    >
      {actionText}
    </button>
  );
};

CopyUrl.displayName = displayName;

export default CopyUrl;
