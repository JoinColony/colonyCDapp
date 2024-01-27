import { UserAvatarProps } from '~v5/shared/UserAvatar/types.ts';

export interface UserInfoListItem {
  key: string;
  userProps: Omit<UserAvatarProps, 'isContributorsList' | 'userStatus'>;
  info: React.ReactNode;
}

export interface UserInfoListProps {
  items: UserInfoListItem[];
  className?: string;
}
