import copyToClipboard from 'copy-to-clipboard';
import React, { type ReactNode, useState, useEffect } from 'react';
import {
  defineMessages,
  FormattedMessage,
  type MessageDescriptor,
  useIntl,
} from 'react-intl';

import { Tooltip } from '~shared/Popover/index.ts';
import { type Address } from '~types/index.ts';

import styles from './InvisibleCopyableAddress.css';

interface Props {
  /** Children element as we don't want style address here */
  children: ReactNode;
  /** Address to display and copy */
  address: Address;
  /** Text which will display in tooltip when hovering on address */
  copyMessage?: MessageDescriptor;
}

const MSG = defineMessages({
  copyAddressTooltip: {
    id: 'InvisibleCopyableAddress.copyAddressTooltip',
    defaultMessage: `{copied, select,
      true {Copied}
      false {{tooltipMessage}}
      other {}
    }`,
  },
  copyMessage: {
    id: 'InvisibleCopyableAddress.copyMessage',
    defaultMessage: 'Click to copy address',
  },
});

const displayName = 'InvisibleCopyableAddress';

const InvisibleCopyableAddress = ({
  children,
  address,
  copyMessage,
}: Props) => {
  const [copied, setCopied] = useState(false);
  const { formatMessage } = useIntl();

  const handleClipboardCopy = () => {
    setCopied(true);
    copyToClipboard(address);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);
  const tooltipMessage =
    (copyMessage && formatMessage(copyMessage)) ||
    formatMessage(MSG.copyMessage);
  return (
    <Tooltip
      placement="right"
      trigger="hover"
      content={
        <FormattedMessage
          {...MSG.copyAddressTooltip}
          values={{ copied, tooltipMessage }}
        />
      }
    >
      <div className={styles.addressWrapper}>
        <div
          onClick={handleClipboardCopy}
          onKeyPress={handleClipboardCopy}
          role="button"
          tabIndex={0}
        >
          {children}
        </div>
      </div>
    </Tooltip>
  );
};

InvisibleCopyableAddress.displayName = displayName;

export default InvisibleCopyableAddress;
