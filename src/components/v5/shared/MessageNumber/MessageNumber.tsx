import React, { FC } from 'react';
import { Chat } from '@phosphor-icons/react';
import { MessageNumberProps } from './types';

const displayName = 'v5.MessageNumber';

const MessageNumber: FC<MessageNumberProps> = ({ message }) =>
  message ? (
    <div className="flex items-center gap-1 text-blue-400 text-xs">
      <Chat size={13} />
      {message}
    </div>
  ) : null;

MessageNumber.displayName = displayName;

export default MessageNumber;
