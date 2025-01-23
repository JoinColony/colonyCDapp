import { Interface } from 'ethers/lib/utils';

import {
  type ColonyActionArbitraryTransaction,
  type ColonyActionFragment,
} from '~gql';

import { type ActionTitleMessageKeys } from '../components/common/ColonyActions/helpers/getActionTitleValues.ts';

export interface DecodedArbitraryTransaction {
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
  if (!jsonAbi) {
    return null;
  }
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
      method: `${functionFragment.name}(${functionFragment.inputs.map((input) => input.type).join(',')})`,
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

export const getDecodedArbitraryTransactions = (
  data: ColonyActionArbitraryTransaction[],
  action: ColonyActionFragment,
) => {
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
  if (
    action?.metadata?.arbitraryTxAbis &&
    action?.metadata?.arbitraryTxAbis.length > 0
  ) {
    messageValues.arbitraryTransactionsLength = arbitraryTransactions.length;

    if (arbitraryTransactions.length === 1) {
      const decoded = decodeArbitraryTransaction(
        action.metadata.arbitraryTxAbis[0]?.jsonAbi,
        arbitraryTransactions[0].encodedFunction,
      );
      if (decoded?.method) {
        messageValues.arbitraryMethod = decoded?.method.replace(
          /\s*\([^)]*\)/g,
          '',
        );
      } else {
        messageValues.arbitraryTransactionsLength = 0;
        messageValues.arbitraryMethod = '';
      }
    }
  }

  return messageValues;
};
