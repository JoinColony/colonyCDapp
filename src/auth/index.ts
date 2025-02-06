import { backOff } from 'exponential-backoff';
import { SiweMessage } from 'siwe';

import { APP_URL } from '~constants/index.ts';
import { ContextModule, getContext } from '~context/index.ts';

const authProxyRequest = async (urlPartial: string, options?: RequestInit) => {
  try {
    const response = await fetch(
      `${import.meta.env.AUTH_PROXY_ENDPOINT}/${urlPartial}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Host: APP_URL.host,
          Origin: APP_URL.origin,
        },
        credentials: 'include',
        ...options,
      },
    );
    return response.json();
  } catch (error) {
    console.error('Could not send authentication request', error);
    return null;
  }
};

export const deauthenticateWallet = async (): Promise<void> => {
  try {
    await authProxyRequest('deauth', { method: 'POST' });
  } catch (error) {
    console.error('Could not deauthenticate user', error);
  }
};

export const authenticateWallet = async (): Promise<void> => {
  const wallet = getContext(ContextModule.Wallet);

  const signer = wallet.ethersProvider.getSigner();

  const authCheck = await authProxyRequest('check');

  if (!authCheck) {
    throw new Error(
      'Could not check authentication status. Proxy server possibly down',
    );
  }

  const { message: authStatus } = authCheck;

  if (authStatus !== 'authenticated') {
    const { data: nonce } = await authProxyRequest('nonce');

    const authMessage = new SiweMessage({
      domain: APP_URL.host,
      address: await signer.getAddress(),
      statement: 'Authentication Session for the Colony CDapp',
      uri: APP_URL.origin,
      version: '1',
      chainId: await signer.getChainId(),
      nonce,
    });

    const message = authMessage.prepareMessage();

    const signature = await signer.signMessage(message);

    const authRequest = await authProxyRequest('auth', {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
    });

    if (authRequest.type === 'error') {
      throw new Error('Auth failed');
    }

    return authRequest;
  }

  return authCheck;
};

export const authenticateWalletWithRetry = async (
  maxRetries: number = 3,
): Promise<void> => {
  return backOff(() => authenticateWallet(), {
    numOfAttempts: maxRetries,
    retry: async (error) => {
      console.error(error);
      if ((error.message as unknown) !== 'Auth failed') {
        throw error;
      }
      return true;
    },
  });
};
