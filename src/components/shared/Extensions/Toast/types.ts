export interface ToastComponentProps {
  url?: string;
  title?: string;
  linkName?: string;
  description?: string;
  type?: ToastType;
}

export type ToastType = 'success' | 'alert' | 'warning';
