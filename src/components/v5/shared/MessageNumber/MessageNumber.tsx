import React, { FC } from 'react';
import Icon from '~shared/Icon';
import { MessageNumberProps } from './types';

const displayName = 'v5.MessageNumber';

const MessageNumber: FC<MessageNumberProps> = ({ message }) =>
  message ? (
    <div className="flex items-center gap-1 text-blue-400 text-xs">
      <Icon name="message" appearance={{ size: 'extraTiny' }} />
      {message}
    </div>
  ) : null;

MessageNumber.displayName = displayName;

export default MessageNumber;
