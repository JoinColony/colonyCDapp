import { type TypedMessageDescriptor } from '~types';

export interface MobileColonyPageSidebarToggleProps {
  isOpen: boolean;
  onClick: () => void;
  label?: TypedMessageDescriptor;
  className?: string;
}
