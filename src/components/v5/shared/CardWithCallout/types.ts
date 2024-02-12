import { type Icon } from '@phosphor-icons/react';
import { type ReactNode } from 'react';

export interface CardWithCalloutProps {
  button?: ReactNode;
  className?: string;
  icon?: Icon;
  title?: ReactNode;
  subtitle?: ReactNode;
  text?: ReactNode;
}
