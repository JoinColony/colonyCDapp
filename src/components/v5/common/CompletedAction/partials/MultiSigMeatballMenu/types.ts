import { type ColonyActionFragment } from '~gql';

export interface MultiSigMeatballMenuProps {
  transactionHash: string;
  multiSigData: ColonyActionFragment['multiSigData'];
}
