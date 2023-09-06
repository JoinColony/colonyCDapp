import { MessageDescriptor } from 'react-intl';

export interface StatusTextProps {
  status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
  title: string | MessageDescriptor;
  withIcon?: boolean;
  fontSizeClassName?: string;
}

export const STATUS_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
} as const;
