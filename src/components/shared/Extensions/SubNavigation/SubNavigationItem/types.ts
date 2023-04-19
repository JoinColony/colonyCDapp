import { ReactNode } from 'react';

export interface SubNavigationItemProps {
  label: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  setOpen: (value: React.SetStateAction<number | undefined>) => void;
  id: number;
}
