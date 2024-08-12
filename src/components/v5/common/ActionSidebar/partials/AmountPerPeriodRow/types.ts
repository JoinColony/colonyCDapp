import { type ActionFormRowProps } from '~v5/common/ActionFormRow/types.ts';

export enum AmountPerInterval {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Custom = 'custom',
}

export interface AmountPerPeriodRowProps
  extends Pick<ActionFormRowProps, 'tooltips'> {
  name: string;
  title?: React.ReactNode;
}
