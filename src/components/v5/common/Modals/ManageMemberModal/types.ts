import { User } from '~types';

export interface ManageMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

export interface ManageMemberListProps {
  id: number;
  label: string;
  value: string;
}
