import { MemberSignatureProps } from '../MemberSignature/types';

export interface MemberSignatureItem extends MemberSignatureProps {
  key: string;
}

export interface MemberSignatureListProps {
  items: MemberSignatureItem[];
  isLoading?: boolean;
  title: React.ReactNode;
}
