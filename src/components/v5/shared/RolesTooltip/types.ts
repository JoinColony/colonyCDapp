import { UserRoleMeta } from '~constants/permissions';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';

export interface RolesTooltipProps {
  role: UserRoleMeta;
  roleDescription?: React.ReactNode;
  tooltipProps?: Omit<TooltipProps, 'tooltipContent'>;
}
