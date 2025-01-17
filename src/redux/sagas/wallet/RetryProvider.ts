import { type Block } from '@ethersproject/providers';
import { providers, utils } from 'ethers';
import { backOff } from 'exponential-backoff';

import { GANACHE_LOCAL_RPC_URL } from '~constants/index.ts';
import { type Address } from '~types/index.ts';
import {
  RetryProviderMethod,
  IColonyContractMethodSignature,
} from '~types/rpcMethods.ts';

type RetryProviderOptions = {
  attempts?: number;
  delay?: number; // in milliseconds
};

const classFactory = (
  walletType: 'MetaMask' | string = '',
  walletAddress?: Address,
) => {
  const devWallet = walletType !== 'MetaMask';

  const Extender = devWallet
    ? providers.JsonRpcProvider
    : providers.Web3Provider;

  return class RetryRpcProvider extends Extender {
    attempts: number;

    delay: number;

    bypassedMethods: string[];

    constructor(options?: RetryProviderOptions) {
      super(devWallet ? GANACHE_LOCAL_RPC_URL : window.ethereum);
      this.attempts = options?.attempts || 5;
      this.delay = options?.delay || 1000;
      this.bypassedMethods = [
        IColonyContractMethodSignature.Locked,
        IColonyContractMethodSignature.Nonces,
        IColonyContractMethodSignature.GetMetatransactionNonce,
        IColonyContractMethodSignature.MakeArbitraryTransactions,
      ].map(RetryRpcProvider.generateBypassedMethodsHex);
    }

    private static generateBypassedMethodsHex(methodSignature: string) {
      return utils.id(methodSignature).slice(0, 10);
    }

    attemptCheck(err, attemptNumber) {
      console.info('Retrying RPC request #', attemptNumber, err);
      if (attemptNumber === this.attempts) {
        return false;
      }
      return true;
    }

    getBlock(blockHashOrBlockTag?: string | number): Promise<Block> {
      return super.getBlock(blockHashOrBlockTag);
    }

    getSigner(
      // If custom address not provided, return the signer of the wallet
      addressOrIndex: string | number | undefined = walletAddress,
    ): providers.JsonRpcSigner {
      return super.getSigner(addressOrIndex);
    }

    getNetwork(): Promise<providers.Network> {
      return backOff(() => super.getNetwork(), {
        retry: this.attemptCheck,
      });
    }

    // This should return a Promise (and may throw erros)
    // method is the method name (e.g. getBalance) and params is an
    // object with normalized values passed in, depending on the method
    perform(method, params) {
      // These methods are methods that we call inside try-catches and expect
      // to fail sometimes, so don't retry.
      if (
        (method === RetryProviderMethod.Call ||
          method === RetryProviderMethod.EstimateGas) &&
        this.bypassedMethods.includes(params?.transaction?.data?.slice(0, 10))
      ) {
        return super.perform(method, params);
      }

      return backOff(() => super.perform(method, params), {
        retry: this.attemptCheck,
        startingDelay: this.delay,
      });
    }
  };
};

export default classFactory;
