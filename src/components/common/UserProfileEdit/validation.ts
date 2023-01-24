import { ethers } from 'ethers';

export const isValidURL = (url: string) => {
  if (!url) {
    return false;
  }

  try {
    // Tidier than using a regex. URL Constructor will error if url string invalid.
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export async function validateCustomGnosisRPC(rpcURL: string | undefined) {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  try {
    await provider.send('eth_protocolVersion', []);
    return true;
  } catch {
    return false;
  }
}
