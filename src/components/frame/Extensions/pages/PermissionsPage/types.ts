import { type UserRole, type UserRoleMeta } from '~constants/permissions.ts';
import { type MemberCardItem } from '~frame/v5/pages/MembersPage/types.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

export interface ExtensionCardItem {
  extension: {
    name: string;
    role?: UserRoleMeta;
  };
  meatBallMenuProps: MeatBallMenuProps;
}

export enum PermissionType {
  Individual = 0,
  MultiSig = 1,
}

export interface MemberRowItem {
  type: 'member';
  data: MemberCardItem;
}
export interface ExtensionRowItem {
  type: 'extension';
  data: ExtensionCardItem;
}

export type ItemsByRole = {
  [key in UserRole]: Array<MemberRowItem | ExtensionRowItem>;
};
