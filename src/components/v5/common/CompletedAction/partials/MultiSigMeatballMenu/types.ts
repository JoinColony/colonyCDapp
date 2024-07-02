import { type ColonyActionType, type ColonyMultiSig } from '~types/graphql.ts';

export interface MultiSigMeatballMenuProps {
  transactionHash: string;
  multiSigData: ColonyMultiSig;
  isOwner: boolean;
  actionType: ColonyActionType;
}
