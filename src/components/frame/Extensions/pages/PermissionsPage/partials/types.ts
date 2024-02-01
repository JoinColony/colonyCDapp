import { type UserRole } from '~constants/permissions.ts';
import { type MemberCardListItem } from '~v5/common/MemberCardList/types.ts';

export type GroupedByPermissionMembersProps = {
  [key in UserRole]: MemberCardListItem[];
};

export interface PermissionPageRowItem extends MemberCardListItem {
  isExtension?: boolean;
}

export interface PermissionPageRowProps {
  title: string;
  description: string;
  members: PermissionPageRowItem[];
  isLoading?: boolean;
  isMultiSig?: boolean;
}
