import { SiweMessage } from 'siwe';

import { ContextModule, getContext } from '~context/index.ts';
import { isFullWallet } from '~types/wallet.ts';

const authProxyRequest = async (urlPartial: string, options?: RequestInit) => {
  const { host, origin } = window.location;
  try {
    const response = await fetch(
      `${process.env.AUTH_PROXY_ENDPOINT}/${urlPartial}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Host: host,
          Origin: origin,
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

  if (!isFullWallet(wallet)) {
    throw new Error('Background login not yet completed.');
  }

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

    const { host, origin } = window.location;

    const authMessage = new SiweMessage({
      domain: host,
      address: await signer.getAddress(),
      statement: 'Authentication Session for the Colony CDapp',
      uri: origin,
      version: '1',
      chainId: await signer.getChainId(),
      nonce,
    });

    const message = authMessage.prepareMessage();

    const signature = await signer.signMessage(message);

    await authProxyRequest('auth', {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
    });
  }
};
