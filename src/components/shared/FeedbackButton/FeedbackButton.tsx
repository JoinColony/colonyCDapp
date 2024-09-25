import { ChatsCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
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
}) => {
  const { isDarkMode } = usePageThemeContext();

  return (
    <Button
      onClick={onClick}
      mode="primaryOutlineFull"
      className={clsx(
        'w-full !justify-start !gap-3 !border-none bg-gray-900 !p-2 !text-base-white',
        {
          '!w-fit !justify-center': isPopoverMode,
          '!bg-gray-100 !text-gray-900 hover:!bg-gray-50': isDarkMode,
          'hover:!bg-gray-800': !isDarkMode,
        },
      )}
      icon={ChatsCircle}
      iconSize={20}
    >
      {!isPopoverMode && (
        <p
          className={clsx('text-md font-medium text-base-white', {
            '!text-gray-900': isDarkMode,
          })}
        >
          {formatText(MSG.label)}
        </p>
      )}
    </Button>
  );
};

export default FeedbackButton;
