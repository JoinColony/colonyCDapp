import { providers } from 'ethers';
import { SiweMessage } from 'siwe';

import { ContextModule, getContext } from '~context';
import { isFullWallet } from '~types';

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
declare global {
  interface Window {
    cookieStore: {
      get: (name: string) => Promise<Record<string, any>>;
      getAll: () => Promise<Record<string, any>[]>;
      delete: (name: string) => Promise<void>;
    };
  }
}

const AUTH_COOKIE_NAME = 'auth';

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

const clearAuthCookie = async (): Promise<void> => {
  if (window.cookieStore) {
    const cookie = await window.cookieStore.get(AUTH_COOKIE_NAME);
    if (cookie) {
      await window.cookieStore.delete(AUTH_COOKIE_NAME);
    }
  }
};

export const getAuthExpirationTimeout = async (): Promise<number> => {
  if (window.cookieStore) {
    const cookie = await window.cookieStore.get(AUTH_COOKIE_NAME);
    if (cookie && cookie.expires) {
      return Math.round(cookie.expires - Date.now());
    }
  }
  return 0;
};

export const deauthenticateWallet = async (): Promise<void> => {
  try {
    await authProxyRequest('deauth', { method: 'POST' });
    await clearAuthCookie();
  } catch (error) {
    console.error('Could not deauthenticate user', error);
  }
};

export const authenticateWallet = async (): Promise<void> => {
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

    await clearAuthCookie();

    await authProxyRequest('auth', {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
    });

    /*
     * We need to start performing a check to see if the user is authenticated
     * As there's a issue when the server goes down / comes back up, it will
     * break the auth session
     *
     * The UI fix for that is to disconect / authenticate again, so we try to
     * replicate that in code, automatically
     */
    const secondAuthCheck = await authProxyRequest('check');

    if (secondAuthCheck?.message !== 'authenticated') {
      await deauthenticateWallet();
      await authenticateWallet();
    }
  }
};
