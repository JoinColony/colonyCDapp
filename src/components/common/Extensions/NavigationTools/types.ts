import { MessageDescriptor } from 'react-intl';
import { NetworkInfo } from '~constants';

export interface NavigationToolsProps {
  buttonLabel?: string | MessageDescriptor;
  nativeToken?: NetworkInfo;
  hideColonies?: boolean;
  hideMemberReputationOnMobile?: boolean;
}
