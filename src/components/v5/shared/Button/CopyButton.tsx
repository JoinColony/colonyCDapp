import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { CopyButtonProps } from './types';
import styles from './CopyButton.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.Button.CopyButton';

const CopyButton: FC<CopyButtonProps> = ({ copyText, label, copiedLabel }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { formatMessage } = useIntl();
  const { handleClipboardCopy } = useCopyToClipboard(copyText);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 5000);
    }
  }, [isCopied]);

  return (
    <button
      type="button"
      className={clsx(styles.copyButton, {
        [styles.copied]: isCopied,
      })}
      onClick={() => {
        setIsCopied(true);
        handleClipboardCopy();
      }}
    >
      <span className="flex mr-2">
        <Icon
          name={isCopied ? 'check' : 'copy-simple'}
          appearance={{ size: 'tiny' }}
        />
      </span>
      {formatMessage(isCopied ? copiedLabel : label)}
    </button>
  );
};

CopyButton.displayName = displayName;

export default CopyButton;
