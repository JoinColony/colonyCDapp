import { type BigNumberish, utils, type TypedDataField } from 'ethers';

import { ContextModule, getContext } from '~context/index.ts';
import { type Address } from '~types/index.ts';

import { generateBroadcasterHumanReadableError } from './errorMessages.ts';

export const signTypedData = async ({
  domain,
  types,
  message,
}: {
  domain: Record<string, unknown>;
  types: Record<string, TypedDataField[]>;
  message: Record<string, unknown>;
}): Promise<{
  signature: string;
  r: string;
  s: string;
  v?: number;
}> => {
  const wallet = getContext(ContextModule.Wallet);

  const signer = wallet.ethersProvider.getSigner();
  // eslint-disable-next-line no-underscore-dangle
  const signature = await signer._signTypedData(domain, types, message);
  const { r, s, v } = utils.splitSignature(signature);
  return { r, s, v, signature };
};

export const generateEIP2612TypedData = ({
  userAddress,
  tokenName,
  chainId,
  verifyingContract,
  spender,
  value,
  nonce,
  deadline,
}: {
  userAddress: Address;
  tokenName: string;
  chainId: string;
  verifyingContract: Address;
  spender: Address;
  value: BigNumberish;
  nonce: BigNumberish;
  deadline: number;
}) => ({
  types: {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  },
  primaryType: 'Permit',
  domain: {
    name: tokenName,
    version: '1',
    chainId,
    verifyingContract,
  },
  message: {
    owner: userAddress,
    spender,
    value: value.toString(),
    nonce: nonce.toString(),
    /*
     * @NOTE One hour in the future from now
     * Time is in seconds
     */
    deadline,
  },
});

export const generateMetatransactionMessage = async ({
  encodedTransaction,
  contractAddress,
  chainId,
  nonce,
}: {
  encodedTransaction: string;
  contractAddress: Address;
  chainId: string;
  nonce: BigNumberish;
}): Promise<{
  message: string;
  messageUint8: Uint8Array;
}> => {
  const message = utils.solidityKeccak256(
    ['uint256', 'address', 'uint256', 'bytes'],
    [nonce.toString(), contractAddress, chainId, encodedTransaction],
  );

  const messageUint8 = utils.arrayify(message);

  return {
    message,
    messageUint8,
  };
};

export const broadcastMetatransaction = async (
  methodName: string,
  broadcastData: Record<string, any> = {},
): Promise<{
  responseData: {
    payload?: string;
    reason?: string;
    txHash?: string;
  };
  reponseStatus: 'fail' | 'success' | 'unknown';
  response: Response;
}> => {
  const response = await fetch(
    `${import.meta.env.METATX_BROADCASTER_ENDPOINT}/broadcast`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(broadcastData),
    },
  );
  const {
    message: responseError,
    status: reponseStatus,
    data: responseData,
  } = await response.json();

  if (reponseStatus !== 'success') {
    throw new Error(
      generateBroadcasterHumanReadableError(
        methodName,
        responseError,
        responseData,
      ),
    );
  }

  return {
    responseData,
    reponseStatus,
    response,
  };
};
