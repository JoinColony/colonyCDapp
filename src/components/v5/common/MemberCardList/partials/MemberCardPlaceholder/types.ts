import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';
import { type ButtonProps } from '~v5/shared/Button/types.ts';

export interface MemberCardPlaceholderProps {
  description: string;
  buttonProps: ButtonProps;
  buttonTooltipProps?: TooltipProps;
}
