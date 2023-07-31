import { MessageDescriptor } from 'react-intl';
import { Token } from '~types';

export interface NavigationToolsProps {
  buttonLabel?: string | MessageDescriptor;
  nativeToken?: Token;
  hideColonies?: boolean;
  hideMemberReputationOnMobile?: boolean;
}
