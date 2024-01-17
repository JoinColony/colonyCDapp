import { UserRoleMeta } from '~constants/permissions';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';

import { LinkProps } from '../Link/types';

export interface RolesTooltipProps {
  role: UserRoleMeta;
  roleDescription?: React.ReactNode;
  tooltipProps?: Omit<TooltipProps, 'tooltipContent'>;
  learnMoreProps?: {
    link?: LinkProps;
    label?: React.ReactNode;
  };
}
