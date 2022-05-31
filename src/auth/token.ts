import { TOKEN_STORAGE } from './constants';

export const setTokenStorage = () =>
  localStorage.setItem(TOKEN_STORAGE, JSON.stringify({}));

export const setToken = (walletAddress: string, token: string) => {
  const storedTokens = localStorage.getItem(TOKEN_STORAGE);

  if (!storedTokens) {
    setTokenStorage();
  }

  if (storedTokens) {
    const parsedStoredTokens = JSON.parse(storedTokens);

    parsedStoredTokens[`${TOKEN_STORAGE}-${walletAddress}`] = token;

    localStorage.setItem(TOKEN_STORAGE, JSON.stringify(parsedStoredTokens));
  }
};

export const getToken = (walletAddress: string) => {
  const storedTokens = localStorage.getItem(TOKEN_STORAGE);

  if (storedTokens) {
    const parsedStoredTokens = JSON.parse(storedTokens);

    return parsedStoredTokens[`${TOKEN_STORAGE}-${walletAddress}`];
  }

  return null;
};

export const clearToken = (walletAddress: string) => {
  const storedTokens = localStorage.getItem(TOKEN_STORAGE);

  if (storedTokens) {
    const parsedStoredTokens = JSON.parse(storedTokens);

    delete parsedStoredTokens[`${TOKEN_STORAGE}-${walletAddress}`];

    localStorage.setItem(TOKEN_STORAGE, JSON.stringify(parsedStoredTokens));
  }
};
