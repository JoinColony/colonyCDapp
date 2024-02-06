import { type Icon } from '@phosphor-icons/react';

export interface WidgetBoxProps {
  title?: React.ReactNode;
  value: React.ReactNode;
  additionalContent?: React.ReactNode;
  className?: string;
  href?: string;
  searchParams?: string;
  icon?: Icon;
  iconClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  onClick?: () => void;
}
