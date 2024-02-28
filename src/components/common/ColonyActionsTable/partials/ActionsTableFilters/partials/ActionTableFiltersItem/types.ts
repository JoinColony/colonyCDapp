import { type IconProps } from '@phosphor-icons/react';
import { type ComponentType } from 'react';

export interface ActionTableFiltersItemProps {
  icon: ComponentType<IconProps>;
  label: string;
  children: React.ReactNode;
}
