import { ColonyLinksProps } from './partials/ColonyLinks/types';

export interface ColonyDashboardHeaderProps {
  colonyName: string;
  description: string;
  colonyLinksProps: ColonyLinksProps;
  tokenName: string;
  isTokenUnlocked?: boolean;
}
