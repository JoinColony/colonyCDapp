import { type Icon } from '@phosphor-icons/react';

import type React from 'react';

export interface IconWithUserPopoverProps {
  icon: Icon;
  tooltipContent: React.ReactNode;
  className?: string;
}
