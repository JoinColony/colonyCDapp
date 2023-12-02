import { providers } from 'ethers';
import { SiweMessage } from 'siwe';

import { ContextModule, getContext } from '~context';
import { isFullWallet } from '~types';

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

export const authenticateWallet = async () => {
  const wallet = getContext(ContextModule.Wallet);

  if (!isFullWallet(wallet)) {
    throw new Error('Background login not yet completed.');
  }

  const walletProvider = new providers.Web3Provider(wallet.provider);
  const signer = walletProvider.getSigner();

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

    return authProxyRequest('auth', {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
    });
  }
  return null;
};

export const deauthenticateWallet = async () => {
  try {
    await authProxyRequest('deauth', { method: 'POST' });
  } catch (error) {
    console.error('Could not deauthenticate user', error);
  }
};

export const getAuthExpirationTimeout = async (): Promise<number> => {
  /*
   * @NOTE This only works on Chrome (and maybe Chromium based browsers),
   * but definitely not on Firefox
   *
   * On Firefox this API is yet to be implemented and last time I checked,
   * I couldn't find a polyfill to do this
   *
   * PS: the `cookie-store` ponyfill, while it works on both Firefox and Chrome,
   * it doesn't have the same interface as the native Chrome one, and it doesn't
   * return the expiration date, which is the only thing we need out of the cookie
   */

  // @ts-ignore
  if (window.cookieStore) {
    // @ts-ignore
    const cookie = await window.cookieStore.get('auth');
    if (cookie && cookie.expires) {
      return Math.round(cookie.expires - Date.now());
    }
  }
  return 0;
};
