import { type Block } from '@ethersproject/providers';
import { providers } from 'ethers';
import { backOff } from 'exponential-backoff';

import { GANACHE_LOCAL_RPC_URL, isDev } from '~constants/index.ts';

type RetryProviderOptions = {
  attempts?: number;
  delay?: number; // in milliseconds
};

const classFactory = (
  Extender = isDev ? providers.JsonRpcProvider : providers.Web3Provider,
) =>
  class RetryRpcProvider extends Extender {
    attempts: number;

    delay: number;

    constructor(options?: RetryProviderOptions) {
      super(isDev ? GANACHE_LOCAL_RPC_URL : window.ethereum);
      this.attempts = options?.attempts || 5;
      this.delay = options?.delay || 1000;
    }

    attemptCheck(err, attemptNumber) {
      // eslint-disable-next-line no-console
      console.log('Retrying RPC request #', attemptNumber, err);
      if (attemptNumber === this.attempts) {
        return false;
      }
      return true;
    }

    getBlock(blockHashOrBlockTag?: string | number): Promise<Block> {
      return super.getBlock(blockHashOrBlockTag);
    }

    getSigner(addressOrIndex?: string | number): providers.JsonRpcSigner {
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
      return backOff(() => super.perform(method, params), {
        retry: this.attemptCheck,
        startingDelay: this.delay,
      });
    }
  };

export default classFactory();
