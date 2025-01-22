import {
  type ColonyActionFragment,
  type ColonyActionArbitraryTransaction,
} from '~gql';
import {
  decodeArbitraryTransaction,
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
  const decodedArbitraryTransactions = data?.map(
    ({ contractAddress, encodedFunction }) => {
      const abi = action.metadata?.arbitraryTxAbis?.find(
        (abiItem) => abiItem.contractAddress === contractAddress,
      );
      if (!abi) {
        return {
          contractAddress,
          encodedFunction,
        };
      }

      const decodedTx = decodeArbitraryTransaction(
        abi.jsonAbi,
        encodedFunction,
      );
      if (!decodedTx) {
        return {
          contractAddress,
          encodedFunction,
          jsonAbi: JSON.stringify(JSON.parse(abi.jsonAbi)),
        };
      }
      return {
        contractAddress,
        jsonAbi: JSON.stringify(JSON.parse(abi.jsonAbi)),
        ...decodedTx,
      };
    },
  );
  return decodedArbitraryTransactions;
};
