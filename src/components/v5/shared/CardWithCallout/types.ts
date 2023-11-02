import type { ReactNode } from 'react';

export interface CardWithCalloutProps {
  button?: ReactNode;
  className?: string;
  iconName?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  text?: ReactNode;
}
