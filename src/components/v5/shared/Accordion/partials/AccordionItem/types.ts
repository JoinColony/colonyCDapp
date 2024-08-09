import { type Icon } from '@phosphor-icons/react';

export interface AccordionItemProps {
  title: React.ReactNode;
  isOpen: boolean;
  onToggle: VoidFunction;
  icon?: Icon;
  className?: string;
  iconSize?: number;
  withDelimiter?: boolean;
}
