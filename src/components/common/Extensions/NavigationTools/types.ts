import { MessageDescriptor } from 'react-intl';
import { Token } from '~types';
import { MemberReputationProps } from '~common/Extensions/UserNavigation/partials/MemberReputation/types';
import { UserAvatarProps } from '~shared/Extensions/UserAvatar/types';

export interface NavigationToolsProps
  extends MemberReputationProps,
    Pick<UserAvatarProps, 'userName' | 'user'> {
  buttonLabel?: string | MessageDescriptor;
  nativeToken?: Token;
}
