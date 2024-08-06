import { ChatsCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';

import { type FeedbackButtonProps } from './types.ts';

const MSG = {
  label: {
    id: 'feedback.label',
    defaultMessage: 'Help & Feedback',
  },
};

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  onClick,
  isPopoverMode,
}) => (
  <Button
    onClick={onClick}
    className={clsx(
      'w-full !justify-start !gap-3 !p-2 !text-base-white hover:!bg-gray-800',
      {
        '!w-fit !justify-center': isPopoverMode,
      },
    )}
  >
    <ChatsCircle className="aspect-auto h-5 w-auto flex-shrink-0 text-base-white" />
    {!isPopoverMode && (
      <p className="text-md font-medium text-base-white">
        {formatText(MSG.label)}
      </p>
    )}
  </Button>
);

export default FeedbackButton;
