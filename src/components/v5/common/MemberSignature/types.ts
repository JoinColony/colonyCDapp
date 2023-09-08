import { AvatarUserProps } from '~v5/shared/AvatarUser/types';

export interface MemberSignatureProps {
  avatar: Omit<AvatarUserProps, 'size'>;
  isChecked: boolean;
}
