import { type User } from '~types/graphql.ts';

export interface UserInfoListItem {
  key: string;
  user: User;
  info: React.ReactNode;
}

export interface UserInfoListProps {
  items: UserInfoListItem[];
  className?: string;
}
