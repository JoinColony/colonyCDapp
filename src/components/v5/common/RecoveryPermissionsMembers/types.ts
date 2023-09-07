import { UserFragment } from '~gql';

export interface RecoveryPermissionsMembersItem extends UserFragment {
  isSigned: boolean;
}
