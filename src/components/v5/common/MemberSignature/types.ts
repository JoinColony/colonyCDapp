import { AvatarUserProps } from '~v5/shared/AvatarUser/types';

export interface MemberSignatureProps {
  avatarProps: Omit<AvatarUserProps, 'size'>;
  isChecked: boolean;
}
