import { Interface } from 'ethers/lib/utils';

import { type ColonyActionFragment } from '~gql';

import { type ActionTitleMessageKeys } from '../components/common/ColonyActions/helpers/getActionTitleValues.ts';

interface DecodedArbitraryTransaction {
  method: string;
  args: Array<{ name: string; value: string; type: string }>;
}

const getFunctionSignature = (encodedFunction: string) => {
  return encodedFunction.startsWith('0x')
    ? encodedFunction.slice(0, 10)
    : `0x${encodedFunction.slice(0, 8)}`;
};

export const decodeArbitraryTransaction = (
  jsonAbi: string,
  encodedFunction: string,
): DecodedArbitraryTransaction | null => {
  try {
    const functionSignature = getFunctionSignature(encodedFunction);

    const iface = new Interface(jsonAbi);
    const functionFragment = iface.getFunction(functionSignature);

    const functionArgs = functionFragment.inputs;
    const decodedArgs = iface.decodeFunctionData(
      functionFragment,
      encodedFunction,
    );

    return {
      method: functionFragment.name,
      args: decodedArgs.map((arg, index) => ({
        name: functionArgs[index].name,
        value: arg.toString(),
        type: functionArgs[index].type,
      })),
    };
  } catch (error) {
    console.error('Failed to decode arbitrary transaction', error);
    return null;
  }
};

export const getDecodedArbitraryTransaction = (transaction) => {
  const abi = transaction.action.metadata?.arbitraryTxAbis?.find(
    (abiItem) => abiItem.contractAddress === transaction.contractAddress,
  );

  if (!abi) {
    return {};
  }

  const decodedTx = decodeArbitraryTransaction(
    abi.jsonAbi,
    transaction.encodedFunction,
  );

  return decodedTx;
};

type ArbitraryFormatMessageValues = {
  [ActionTitleMessageKeys.ArbitraryTransactionsLength]: number;
  [ActionTitleMessageKeys.ArbitraryMethod]: string;
};

export const getFormatValuesArbitraryTransactions = (
  action: ColonyActionFragment,
): ArbitraryFormatMessageValues => {
  const messageValues: ArbitraryFormatMessageValues = {
    arbitraryMethod: '',
    arbitraryTransactionsLength: 0,
  };
  const arbitraryTransactions = action.arbitraryTransactions || [];
  messageValues.arbitraryTransactionsLength = arbitraryTransactions.length;

  if (arbitraryTransactions.length === 1 && action?.metadata?.arbitraryTxAbis) {
    const decoded = decodeArbitraryTransaction(
      action.metadata.arbitraryTxAbis[0].jsonAbi,
      arbitraryTransactions[0].encodedFunction,
    );
    messageValues.arbitraryMethod = decoded?.method || '';
  }
  return messageValues;
};
