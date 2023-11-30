import { TooltipProps } from '~shared/Extensions/Tooltip/types';
import { ButtonProps } from '~v5/shared/Button/types';

export interface MemberCardPlaceholderProps {
  description: string;
  buttonProps: ButtonProps;
  buttonTooltipProps?: TooltipProps;
}
