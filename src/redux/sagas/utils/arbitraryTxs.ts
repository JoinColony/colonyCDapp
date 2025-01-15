import { Interface } from 'ethers/lib/utils';

import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';

/**
 * Parses a string representation of an array into an array of values.
 * It supports nested arrays and handles strings within arrays.
 */
const getArrayFromString = (value: string, type: string) => {
  if (value === '[]') {
    return [];
  }

  if (!value.startsWith('[') || !value.endsWith(']')) {
    throw new Error('Invalid array format');
  }

  const contents = value.slice(1, -1);
  const parsedElements: string[] = [];

  let bracketLevel = 0;
  let isInString = false;
  let startIndex = 0;

  for (let i = 0; i < contents.length; i += 1) {
    const char = contents[i];
    if (char === '"') {
      isInString = !isInString;
    }

    if (char === '[') {
      bracketLevel += 1;
    } else if (char === ']') {
      bracketLevel -= 1;
    }

    const isLastChar = i === contents.length - 1;
    if ((char === ',' || isLastChar) && !isInString && bracketLevel === 0) {
      const endIndex = isLastChar ? contents.length : i;
      parsedElements.push(contents.slice(startIndex, endIndex).trim());
      startIndex = i + 1;
    }
  }

  return parsedElements.map((element) => {
    const elementType = type.slice(0, -2);

    if (elementType.endsWith('[]')) {
      return getArrayFromString(element, elementType);
    }
    return element;
  });
};

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
          return getArrayFromString(arg.value, arg.type);
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
