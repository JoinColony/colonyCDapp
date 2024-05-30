import { type ColonyMultiSigFragment } from '~gql';

export interface MultiSigMeatballMenuProps {
  transactionHash: string;
  multiSigData: ColonyMultiSigFragment;
}
