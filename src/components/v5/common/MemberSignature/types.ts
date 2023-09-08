import { AvatarUserProps } from '~v5/shared/AvatarUser/types';

export interface MemberSignatureProps
  extends Omit<AvatarUserProps, 'size' | 'isLink'> {
  isChecked: boolean;
}
