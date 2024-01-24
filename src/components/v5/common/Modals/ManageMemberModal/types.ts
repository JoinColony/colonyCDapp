import { User } from '~types/graphql';

export interface ManageMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}
