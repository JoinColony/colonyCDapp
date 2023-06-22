export type UserBadgesType =
  | 'dedicated'
  | 'active'
  | 'new'
  | 'top'
  | 'banned'
  | 'team';

export interface UserBadgesProps {
  size: 'small' | 'medium';
  type: UserBadgesType;
  isStatus: boolean;
}
