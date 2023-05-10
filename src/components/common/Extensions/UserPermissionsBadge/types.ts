import { MessageDescriptor } from 'react-intl';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';
import { SimpleMessageValues } from '~types';

export interface UserPermissionsBadgeProps extends Omit<TooltipProps, 'tooltipContent'> {
  text?: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  description?: MessageDescriptor | string;
  descriptionValues?: SimpleMessageValues;
  name: string;
}
