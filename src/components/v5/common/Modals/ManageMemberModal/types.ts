import { MessageDescriptor } from 'react-intl';
import { User } from '~types';

export interface ManageMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export interface ManageMemberListProps {
  id: number;
  label: MessageDescriptor;
  value: MemberActionType;
}

export type MemberActionType =
  | 'ban'
  | 'unban'
  | 'reduceReputation'
  | 'awardReputation'
  | 'addVerifiedMember'
  | 'removeVerifiedMember'
  | 'editPermissions';
