import { type MessageDescriptor } from 'react-intl';

import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';
import { type SimpleMessageValues } from '~types/index.ts';

export interface UserPermissionsBadgeProps
  extends Omit<TooltipProps, 'tooltipContent'> {
  text: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  description: MessageDescriptor | string;
  descriptionValues?: SimpleMessageValues;
  name: string;
}
