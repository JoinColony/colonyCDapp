import { Chat } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { type MessageNumberProps } from './types.ts';

const displayName = 'v5.MessageNumber';

const MessageNumber: FC<MessageNumberProps> = ({ message }) =>
  message ? (
    <div className="flex items-center gap-1 text-xs text-blue-400">
      <Chat size={13} />
      {message}
    </div>
  ) : null;

MessageNumber.displayName = displayName;

export default MessageNumber;
