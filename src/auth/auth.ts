import jwtDecode from 'jwt-decode';

import { createAddress } from '~utils/web3';

import { getToken, clearToken, setToken } from './token';
import { URL_AUTH_TOKEN, URL_AUTH_CHALLENGE } from './constants';

const postRequest = async (path: string, data: object) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const authenticate = async (wallet) => {
  try {
    const token = getToken(wallet.address);

    if (token) {
      const tokenData = jwtDecode(token);
      if (
        createAddress(tokenData.address) === createAddress(wallet.address) &&
        // JWT expiry dates are noted in seconds
        tokenData.exp * 10 ** 3 > Date.now()
      ) {
        return token;
      }
    }
  } catch (error) {
    console.error(error);
    console.info(
      'Found invalid JWT, clearing token for address',
      wallet.address,
    );
    clearToken(wallet.address);
  }

  const { challenge } = await postRequest(URL_AUTH_CHALLENGE, {
    address: wallet.address,
  });
  const signature = await wallet.signMessage({ message: challenge });
  const { token: refreshedToken } = await postRequest(URL_AUTH_TOKEN, {
    challenge,
    signature,
  });
  setToken(wallet.address, refreshedToken);
  return refreshedToken;
};
