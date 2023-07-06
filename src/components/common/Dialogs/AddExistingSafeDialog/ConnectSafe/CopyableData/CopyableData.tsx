import React from 'react';
import {
  FormattedMessage,
  defineMessages,
  useIntl,
  MessageDescriptor,
} from 'react-intl';

import { useClipboardCopy } from '~hooks';
import { Tooltip } from '~shared/Popover';
import Icon from '~shared/Icon';

import styles from './CopyableData.css';

const displayName = 'common.AddExistingSafeDialog.ConnectSafe.CopyableData';

const MSG = defineMessages({
  copyDataTooltip: {
    id: `${displayName}.copyAddressTooltip`,
    defaultMessage: `{isCopied, select,
      true {Copied}
      other {{tooltipMessage}}
    }`,
  },
  copyMessage: {
    id: `${displayName}.copyMessage`,
    defaultMessage: 'Click to copy',
  },
});

interface Props {
  label: MessageDescriptor;
  text: string;
}

const CopyableData = ({ label, text }: Props) => {
  const { isCopied, handleClipboardCopy } = useClipboardCopy(text);
  const { formatMessage } = useIntl();
  const tooltipMessage = formatMessage(MSG.copyMessage);

  return (
    <div className={styles.copyableContainer}>
      <span className={styles.subtitle}>
        <FormattedMessage {...label} />
      </span>
      <div className={`${styles.copyable} ${styles.fat}`}>
        <span>{text}</span>
        <Tooltip
          trigger="hover"
          content={
            <FormattedMessage
              {...MSG.copyDataTooltip}
              values={{ isCopied, tooltipMessage }}
            />
          }
        >
          <Icon
            appearance={{ size: 'normal' }}
            name="copy"
            onClick={handleClipboardCopy}
          />
        </Tooltip>
      </div>
    </div>
  );
};

CopyableData.displayName = displayName;

export default CopyableData;
