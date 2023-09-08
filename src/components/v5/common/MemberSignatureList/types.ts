import { MemberSignatureProps } from '../MemberSignature/types';

export interface MemberSignatureListProps {
  items: MemberSignatureProps[];
  checkedUsersList: string[];
  isLoading?: boolean;
  title: React.ReactNode;
}
