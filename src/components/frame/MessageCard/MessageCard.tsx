import React from 'react';
import { FormattedMessage } from 'react-intl';

import { type MessageType } from '~redux/immutable/index.ts';
import Card from '~shared/Card/index.ts';
import Heading from '~shared/Heading/index.ts';

import MessageCardStatus from './MessageCardStatus.tsx';

import styles from './MessageCard.module.css';

const displayName = 'frame.GasStation.MessageCard';

interface Props {
  message: MessageType;
  idx: number;
  onClick?: (idx: number) => void;
}

const MessageCard = ({ message: { status, purpose }, onClick, idx }: Props) => (
  <Card className={styles.main}>
    <button
      type="button"
      className={styles.button}
      onClick={() => onClick && onClick(idx)}
      disabled={!onClick}
    >
      <div className={styles.summary}>
        <div className={styles.description}>
          <Heading
            appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
            text={{ id: `message.${purpose}.title` }}
          />
          <FormattedMessage id={`message.${purpose}.description`} />
        </div>
        <MessageCardStatus status={status} />
      </div>
    </button>
  </Card>
);

MessageCard.displayName = displayName;

export default MessageCard;
