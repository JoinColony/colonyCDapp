import { type IconSize } from '~shared/Icon/Icon.tsx';

export interface AccordionItemProps {
  title: React.ReactNode;
  isOpen: boolean;
  onToggle: VoidFunction;
  iconName?: string;
  className?: string;
  iconSize?: IconSize;
}
