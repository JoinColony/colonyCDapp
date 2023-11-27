import { UserFragment } from '~gql';

export interface UseUserAvatarsReturnType {
  remainingAvatarsCount: number;
  registeredUsers: UserFragment[];
}
