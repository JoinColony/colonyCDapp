import { ReactNode } from 'react';

export interface SubNavigationItemMobileProps {
  label: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  setOpen: (value: React.SetStateAction<number | undefined>) => void;
  id: number;
  icon: string;
}
