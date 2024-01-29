import { type IconProps } from '~shared/Icon/Icon.tsx';

import type React from 'react';

export interface IconWithTooltipProps {
  tooltipContent: React.ReactNode;
  iconProps: IconProps;
  className?: string;
}
