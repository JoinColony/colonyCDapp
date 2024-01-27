import { MessageDescriptor } from 'react-intl';

import { TooltipProps } from '~shared/Extensions/Tooltip/types.ts';
import { SimpleMessageValues } from '~types/index.ts';

export interface UserPermissionsBadgeProps
  extends Omit<TooltipProps, 'tooltipContent'> {
  text: MessageDescriptor | string;
  textValues?: SimpleMessageValues;
  description: MessageDescriptor | string;
  descriptionValues?: SimpleMessageValues;
  name: string;
}
