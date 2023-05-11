import { TransactionResponse } from '@ethersproject/providers';
import { Contract, BigNumberish, utils, providers } from 'ethers';
import { ContractClient, ClientType } from '@colony/colony-js';

import {
  generateMetatransactionErrorMessage,
  generateMetamaskTypedDataSignatureErrorMessage,
} from '~utils/web3';
import { TransactionRecord } from '../../immutable';
import { ContextModule, getContext } from '~context';
import {
  MethodParams,
  MetatransactionFlavour,
  MetamaskRpcErrors,
  TRANSACTION_METHODS,
  ExtendedClientType,
  isFullWallet,
} from '~types';

import {
  getChainId,
  generateEIP2612TypedData,
  generateMetatransactionMessage,
  broadcastMetatransaction,
  signTypedData,
} from '../utils';

async function getMetatransactionPromise(
  client: ContractClient,
  { methodName, params, identifier: clientAddress }: TransactionRecord,
): Promise<TransactionResponse> {
  const wallet = getContext(ContextModule.Wallet);

  if (!isFullWallet(wallet)) {
    throw new Error('Background login not yet completed.');
  }

  const walletProvider = new providers.Web3Provider(wallet.provider);
  const signer = walletProvider.getSigner();

  let colonyManager;
  try {
    colonyManager = getContext(ContextModule.ColonyManager);
  } catch (error) {
    throw new Error(
      `Cannot generate Metatransaction. ColonyManager is not yet instantiated. ${error.message}`,
    );
  }

  const { networkClient } = colonyManager;
  const { address: userAddress } = wallet;
  const chainId = await getChainId();

  let normalizedMethodName: string = methodName;
  let normalizedClient: any = client; // Disregard the `any`. The new ColonyJS messed up all the types
  let lightTokenClient: any = client; // Disregard the `any`. The new ColonyJS messed up all the types
  let normalizedParams: MethodParams = params;
  let availableNonce: BigNumberish | undefined;
  let broadcastData: Record<string, any> = {};

  switch (methodName) {
    /*
     * For metatransactions we have to use the DeployTokenViaNetwork method
     */
    case TRANSACTION_METHODS.DeployToken:
      normalizedMethodName = TRANSACTION_METHODS.DeployTokenViaNetwork;
      break;
    /*
     * DeployTokenAuthority is not available on the contracts in normal circumstances (we add it via colonyJS)
     * But with metatransactions, it exits, but on a different client, with different params
     * So we have to do this ugly switch-aroo just to make the different api happy :(
     */
    case TRANSACTION_METHODS.DeployTokenAuthority: {
      normalizedClient = networkClient;
      const [tokenAddress, allowedToTransfer] = params;
      normalizedParams = [
        tokenAddress,
        clientAddress as string,
        allowedToTransfer,
      ];
      break;
    }
    default:
      break;
  }

  /*
   * @NOTE We have two ways to go about Metatransactions when it comes to the Token Client
   * Either vanilla metransactions or Signed Approvals (EIP2612). We need to check for both,
   * and attempt to use of them
   */
  if (normalizedClient.clientType === ClientType.TokenClient) {
    /*
     * @NOTE If it's a TokenClient we need to reinstantiate as the "light" token client
     * basically a frankenstein's monster (currently) supporting both Metatransactions
     * and EIP-2612 (or attempting to anyway)
     */
    lightTokenClient = new Contract(
      clientAddress as string,
      [
        'function getMetatransactionNonce(address) view returns (uint256)',
        'function nonces(address) view returns (uint256)',
      ],
      colonyManager.signer,
    );
    lightTokenClient.clientType = ClientType.TokenClient;
    /*
     * @NOTE This is only used in error reporting, if the token contract
     * does not support neither vanilla metatransactions or eip2612 metransactions
     */
    lightTokenClient.tokenClientType = ExtendedClientType.LightTokenClient;
    lightTokenClient.metatransactionVariation = MetatransactionFlavour.Vanilla;

    /*
     * See if the token supports Metatransactions
     */
    try {
      availableNonce = await lightTokenClient.getMetatransactionNonce(
        userAddress,
      );
      lightTokenClient.metatransactionVariation =
        MetatransactionFlavour.Vanilla;
    } catch (error) {
      // silent error
    }
    /*
     * Otherwise, see if supports EIP-2612
     * https://eips.ethereum.org/EIPS/eip-2612
     */
    try {
      availableNonce = await lightTokenClient.nonces(userAddress);
      lightTokenClient.metatransactionVariation =
        MetatransactionFlavour.EIP2612;
    } catch (error) {
      // silent error
    }
    if (!availableNonce) {
      throw new Error(generateMetatransactionErrorMessage(lightTokenClient));
    }
  } else {
    /*
     * If the client we're going to query doesn't have such a call it means that
     * most likely it doesn't support metatransactions.
     * This can be either our contracts (older ones) or external contracts without
     * support
     */
    try {
      availableNonce = await normalizedClient.getMetatransactionNonce(
        userAddress,
      );
    } catch (error) {
      throw new Error(generateMetatransactionErrorMessage(normalizedClient));
    }
  }

  /*
   * @NOTE For the EIP2612 metatransaction variation we only support the
   * TokenClient.approve method, every other call needs to go through
   * vanilla metatransactions
   */
  if (
    normalizedClient.clientType === ClientType.TokenClient &&
    lightTokenClient.metatransactionVariation ===
      MetatransactionFlavour.EIP2612 &&
    normalizedMethodName === TRANSACTION_METHODS.Approve
  ) {
    const tokenName = await normalizedClient.name();
    const [spender, amount] = params;
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    try {
      const { r, s, v } = await signTypedData(
        generateEIP2612TypedData(
          userAddress,
          tokenName,
          chainId,
          normalizedClient.address,
          spender as string,
          amount as BigNumberish,
          availableNonce as BigNumberish,
          deadline,
        ),
      );

      broadcastData = {
        target: normalizedClient.address,
        owner: userAddress,
        spender,
        value: amount.toString(),
        deadline,
        r,
        s,
        v,
      };
    } catch (error) {
      if (
        error.message.includes(MetamaskRpcErrors.TypedDataSignDifferentChain)
      ) {
        throw new Error(
          generateMetamaskTypedDataSignatureErrorMessage(chainId),
        );
      }
      throw new Error(error.message);
    }
  } else {
    /*
     * All the 'WithProofs' helpers don't really exist on chain, so we have to
     * make sure we are calling the on-chain method, rather than our own helper
     */
    const encodedTransaction = await normalizedClient.interface.functions[
      normalizedMethodName
    ].encode([...normalizedParams]);

    const { messageUint8: messageData } = await generateMetatransactionMessage(
      encodedTransaction,
      normalizedClient.address,
      chainId,
      availableNonce as BigNumberish,
    );

    const metatransactionSignature = await signer.signMessage(messageData);

    const { r, s, v } = utils.splitSignature(metatransactionSignature);

    broadcastData = {
      target: normalizedClient.address,
      payload: encodedTransaction,
      userAddress,
      r,
      s,
      v,
    };
  }

  const {
    responseData: { txHash: hash },
  } = await broadcastMetatransaction(normalizedMethodName, broadcastData);

  return { hash } as TransactionResponse;
}

export default getMetatransactionPromise;
