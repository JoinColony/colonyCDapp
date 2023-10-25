import { ColonyContributorFragment } from '~gql';

export interface TableProps {
  name: string;
  list: ColonyContributorFragment[];
}

export interface VerifiedTableModel {
  key: string;
}
