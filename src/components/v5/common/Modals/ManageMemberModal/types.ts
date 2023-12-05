import { User } from '~types';

export interface ManageMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}
