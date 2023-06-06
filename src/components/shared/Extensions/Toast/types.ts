export interface ToastProps {
  url?: string;
  title?: string;
  linkName?: string;
  description?: string;
  type?: ToastType;
}

export type ToastType = 'success' | 'warn' | 'error';
