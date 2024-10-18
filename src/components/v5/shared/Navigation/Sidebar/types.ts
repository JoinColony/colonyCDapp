import { type PropsWithChildren } from 'react';

import { type FeedbackButtonProps } from '~shared/FeedbackButton/types.ts';

import { type ColonySwitcherProps } from '../ColonySwitcher/types.ts';

export interface SidebarProps extends PropsWithChildren {
  showColonySwitcher?: boolean;
  showFeedbackButton?: boolean;
  showColonyLogo?: boolean;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  colonySwitcherProps?: ColonySwitcherProps;
  feedbackButtonProps?: FeedbackButtonProps;
}
