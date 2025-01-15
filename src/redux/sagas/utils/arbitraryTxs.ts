import { Interface } from 'ethers/lib/utils';

import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';

export const encodeArbitraryTransactions = (
  transactions: AddTransactionTableModel[],
) => {
  const contractAddresses: string[] = [];
  const methodsBytes: string[] = [];

  transactions.forEach(({ contractAddress, ...item }) => {
    const encodedFunction = new Interface(item.jsonAbi).encodeFunctionData(
      item.method,
      item.args?.map((arg) => {
        if (arg.type.endsWith('[]')) {
          return JSON.parse(arg.value);
        }
        return arg.value;
      }),
    );

    contractAddresses.push(contractAddress);
    methodsBytes.push(encodedFunction);
  });

  return {
    contractAddresses,
    methodsBytes,
  };
};
