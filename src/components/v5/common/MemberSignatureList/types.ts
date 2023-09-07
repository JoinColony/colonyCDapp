import { User } from '~types';

export interface MemberSignatureListProps {
  items: User[];
  checkedUsersList: string[];
  isLoading?: boolean;
  title: React.ReactNode;
}
