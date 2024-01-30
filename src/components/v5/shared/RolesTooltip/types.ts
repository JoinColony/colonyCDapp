import { type UserRoleMeta } from '~constants/permissions.ts';
import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';

export interface RolesTooltipProps {
  role: UserRoleMeta;
  roleDescription?: React.ReactNode;
  tooltipProps?: Omit<TooltipProps, 'tooltipContent'>;
}
