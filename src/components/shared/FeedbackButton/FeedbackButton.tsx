import { ChatsCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import { noop } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { LEARN_MORE_COLONY_HELP_GENERAL } from '~constants';
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

const FEEDBACK_BUTTON_ID = 'sidebar-feedback-button';

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  onClick,
  isPopoverMode,
  widgetPlacement,
}) => {
  const { isDarkMode } = usePageThemeContext();

  const [showBadge, setShowBadge] = useState(false);

  const [isIntercomBooted, setIsIntercomBooted] = useState(
    typeof window.Intercom !== 'undefined',
  );

  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const bootIntercom = useCallback(() => {
    if (typeof window.Intercom !== 'undefined') {
      window.Intercom('boot', {
        alignment: widgetPlacement?.alignment ?? 'left',
        // eslint-disable-next-line camelcase
        horizontal_padding: widgetPlacement?.horizontalPadding ?? 0,
        // eslint-disable-next-line camelcase
        vertical_padding: widgetPlacement?.verticalPadding ?? 48,
      });

      setIsIntercomBooted(true);
    }
  }, [
    widgetPlacement?.alignment,
    widgetPlacement?.horizontalPadding,
    widgetPlacement?.verticalPadding,
  ]);

  useEffect(() => {
    bootIntercom();

    if (!isIntercomBooted) {
      return noop;
    }

    const hideIntercom = () => {
      window.Intercom('hide');
    };

    window.Intercom('onUnreadCountChange', (unreadMessages: number) => {
      setShowBadge(unreadMessages > 0);
    });

    window.Intercom('onShow', () => {
      setIsWidgetOpen(true);
    });

    window.Intercom('onHide', () => {
      setIsWidgetOpen(false);
    });

    const handleClickOutside = (event: MouseEvent) => {
      const intercomFrame = document.querySelector('.intercom-messenger-frame');
      const feedbackButton = document.querySelector(`#${FEEDBACK_BUTTON_ID}`);

      if (
        !intercomFrame?.contains(event.target as Node) &&
        !feedbackButton?.contains(event.target as Node)
      ) {
        hideIntercom();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    window.addEventListener('beforeunload', hideIntercom);

    return () => {
      window.removeEventListener('beforeunload', hideIntercom);

      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [bootIntercom, isIntercomBooted]);

  const handleClick = useCallback(() => {
    onClick?.();

    if (!isIntercomBooted) {
      bootIntercom();
    }

    try {
      window.Intercom(isWidgetOpen ? 'hide' : 'show');
    } catch (error) {
      window.open(LEARN_MORE_COLONY_HELP_GENERAL, '_blank');
    }
  }, [bootIntercom, isIntercomBooted, isWidgetOpen, onClick]);

  return (
    <Button
      id={FEEDBACK_BUTTON_ID}
      onClick={handleClick}
      className={clsx(
        'relative w-full !justify-start !gap-3 !border-none bg-gray-900 !p-2',
        {
          '!w-fit !justify-center': isPopoverMode,
          '!bg-gray-100 hover:!bg-gray-50': isDarkMode,
          '!bg-gray-50': isDarkMode && isWidgetOpen,
          'hover:!bg-gray-800': !isDarkMode,
          '!bg-gray-800': !isDarkMode && isWidgetOpen,
        },
      )}
      iconSize={20}
    >
      <ChatsCircle
        className={clsx(
          'relative aspect-auto h-5 w-auto flex-shrink-0 text-base-white',
          {
            '!text-gray-900': isDarkMode,
          },
        )}
      />
      {!isPopoverMode && (
        <p
          className={clsx('text-md font-medium text-base-white', {
            '!text-gray-900': isDarkMode,
          })}
        >
          {formatText(MSG.label)}
        </p>
      )}
      {showBadge && (
        <div className="absolute right-2 aspect-square h-2 animate-pulse rounded-full bg-blue-400" />
      )}
    </Button>
  );
};

export default FeedbackButton;
