import { STATUS_TYPES } from './consts';

export interface StatusTextProps {
  status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
  withIcon?: boolean;
  textClassName?: string;
}
