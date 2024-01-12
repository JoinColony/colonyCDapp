import { Token } from '~types';

import { ColonyLinksProps } from './partials/ColonyLinks/types';

export interface ColonyDashboardHeaderProps {
  colonyLinksProps: ColonyLinksProps;
  colonyName: string;
  description: string;
  isTokenUnlocked?: boolean;
  leaveColonyConfirmOpen: boolean;
  setLeaveColonyConfirm: (isOpen: boolean) => void;
  token?: Token;
}
