import { type MessageDescriptor } from 'react-intl';

export interface ToastProps {
  url?: string;
  title?: MessageDescriptor | string;
  linkName?: string;
  description?: MessageDescriptor | string;
  type?: ToastType;
}

export type ToastType = 'success' | 'warn' | 'error';
