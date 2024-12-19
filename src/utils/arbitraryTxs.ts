import { Interface } from 'ethers/lib/utils';

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
