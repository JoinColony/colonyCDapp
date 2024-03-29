import { Check } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TransactionStatus } from '~gql';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';

import styles from './MessageCardStatus.module.css';

const displayName = 'frame.GasStation.MessageCard.MessageCardStatus';

const MSG = defineMessages({
  messageState: {
    id: `${displayName}.messageState`,
    defaultMessage: `{status, select,
      CREATED {The message is ready to be signed}
      PENDING {The message is being signed}
      SUCCEEDED {The message was signed successfully}
      FAILED {Failed to sign the message}
      other {Can't report any status}
    }`,
  },
});

interface Props {
  status?: TransactionStatus;
}

const MessageCardStatus = ({ status }: Props) => (
  <div className={styles.main}>
    <Tooltip
      /* Because it's in an overflow window */
      popperOptions={{ strategy: 'fixed' }}
      placement="bottom"
      tooltipContent={
        <span>
          <FormattedMessage {...MSG.messageState} values={{ status }} />
        </span>
      }
    >
      {/*
       * @NOTE The tooltip content needs to be wrapped inside a block
       * element otherwise it won't detect the hover event
       */}
      <div>
        {/*
         * @NOTE There's never going to be more then a message to sign at a
         * given time, so the counter will always show 1
         */}
        {status === TransactionStatus.Created && (
          <span className={styles.counter}>1</span>
        )}
        {status === TransactionStatus.Pending && (
          <div>
            <SpinnerLoader appearance={{ size: 'small', theme: 'primary' }} />
          </div>
        )}
        {status === TransactionStatus.Succeeded && (
          <span
            className={styles.completed}
            data-test="gasStationTransactionSucceeded"
          >
            <Check size={14} />
          </span>
        )}
        {status === TransactionStatus.Failed && (
          <span className={styles.failed}>!</span>
        )}
      </div>
    </Tooltip>
  </div>
);

MessageCardStatus.displayName = displayName;

export default MessageCardStatus;
