import { ReactNode } from 'react';

export interface SubNavigationItemProps {
  label: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  setOpen: () => void;
  id: number;
  icon: string;
}
