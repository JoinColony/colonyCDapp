import { BigNumberish, utils, providers, TypedDataField } from 'ethers';

import { Address, Network } from '~types';

import { DEFAULT_NETWORK, DEFAULT_NETWORK_INFO } from '~constants';
import { ContextModule, getContext } from '~context';

import { generateBroadcasterHumanReadableError } from './errorMessages';

export async function getChainId(): Promise<number> {
  /*
   * @NOTE Short-circuit early, skip making an unnecessary RPC call
   */
  if (DEFAULT_NETWORK === Network.Ganache) {
    /*
     * Due to ganache internals shannanigans, when on the local ganache network
     * we must use chainId 1, otherwise the broadcaster (and the underlying contracts)
     * wont't be able to verify the signature (due to a chainId miss-match)
     *
     * This issue is only valid for ganache networks, as in production the chain id
     * is returned properly
     */
    return 1;
  }
  return DEFAULT_NETWORK_INFO.chainId;
}

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
  const walletProvider = new providers.Web3Provider(wallet.provider);
  const signer = walletProvider.getSigner();
  // eslint-disable-next-line no-underscore-dangle
  const signature = await signer._signTypedData(domain, types, message);
  const { r, s, v } = utils.splitSignature(signature);
  return { r, s, v, signature };
};

export const generateEIP2612TypedData = (
  userAddress: Address,
  tokenName: string,
  chainId: number,
  verifyingContract: Address,
  spender: Address,
  value: BigNumberish,
  nonce: BigNumberish,
  deadline: number,
) => ({
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

export const generateMetatransactionMessage = async (
  encodedTransaction: string,
  contractAddress: Address,
  chainId: number,
  nonce: BigNumberish,
): Promise<{
  message: string;
  messageUint8: Uint8Array;
}> => {
  const message = utils.solidityKeccak256(
    ['uint256', 'address', 'uint256', 'bytes'],
    [nonce.toString(), contractAddress, chainId, encodedTransaction],
  );
  const messageBuffer = Buffer.from(
    message.slice(2), // remove the `0x` prefix
    'hex',
  );

  const messageUint8 = Array.from(messageBuffer) as unknown as Uint8Array;
  /*
   * Purser validator expects either a string or a Uint8Array. We convert this
   * to a an array to make Metamask happy when signing the buffer.
   *
   * So in order to actually pass validation, both for Software and Metamask
   * wallets we need to "fake" the array as actually being a Uint.
   *
   * Note this not affect the format of the data passed in to be signed,
   * or the signature.
   */
  messageUint8.constructor = Uint8Array;

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
    `${process.env.BROADCASTER_ENDPOINT}/broadcast`,
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
