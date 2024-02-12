import { type Icon } from '@phosphor-icons/react';
import { type ReactNode } from 'react';

export interface SubNavigationItemProps {
  label: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  setOpen: () => void;
  id: number;
  icon: Icon;
}
