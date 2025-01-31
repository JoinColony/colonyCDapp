import {
  type ColonyActionFragment,
  type ColonyActionArbitraryTransaction,
} from '~gql';
import {
  getDecodedArbitraryTransactions,
  type DecodedArbitraryTransaction,
} from '~utils/arbitraryTxs.ts';

export interface CompletedArbitraryTransactions
  extends Partial<DecodedArbitraryTransaction> {
  encodedFunction?: string;
  contractAddress: string;
  jsonAbi?: string;
}

export const useTransformArbitraryTransactions = (
  data: ColonyActionArbitraryTransaction[],
  action: ColonyActionFragment,
): CompletedArbitraryTransactions[] => {
  return getDecodedArbitraryTransactions(data, action);
};
