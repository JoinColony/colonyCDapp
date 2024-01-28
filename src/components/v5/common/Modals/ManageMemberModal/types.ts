import { type User } from '~types/graphql.ts';

export interface ManageMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}
