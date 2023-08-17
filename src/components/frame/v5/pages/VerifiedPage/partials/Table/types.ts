import { ColonyContributor } from '~types';

export interface TableProps {
  list: ColonyContributor[];
  onReputationSortClick: () => void;
}
