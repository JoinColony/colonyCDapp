import { type IconProps } from '@phosphor-icons/react';
import { type ComponentType } from 'react';

export interface AgreementsPageFiltersItemProps {
  icon: ComponentType<IconProps>;
  label: string;
  children: React.ReactNode;
}
