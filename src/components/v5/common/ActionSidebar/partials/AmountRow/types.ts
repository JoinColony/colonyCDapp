import { type ActionFormRowProps } from '~v5/common/ActionFormRow/types.ts';

import { type AmountFieldProps } from '../AmountField/types.ts';

export interface AmountRowProps
  extends Pick<AmountFieldProps, 'domainId'>,
    Pick<ActionFormRowProps, 'tooltips'> {
  title?: React.ReactNode;
}
