import { ChatCircle } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import {
  sidebarButtonIconStyles,
  sidebarButtonStyles,
  sidebarButtonTextStyles,
} from '~v5/common/Navigation/consts.ts';
import Button from '~v5/shared/Button/index.ts';

const displayName = 'v5.frame.NavigationSidebar.partials.FeedbackButton';

const MSG = defineMessages({
  feedback: {
    id: `${displayName}.feedback`,
    defaultMessage: 'Feedback',
  },
});

const FeedbackButton = () => {
  return (
    <Button className={sidebarButtonStyles}>
      <ChatCircle className={sidebarButtonIconStyles} />
      <p className={sidebarButtonTextStyles}>
        {formatText<typeof MSG>({ id: 'feedback' })}
      </p>
    </Button>
  );
};

FeedbackButton.displayName = displayName;

export default FeedbackButton;
