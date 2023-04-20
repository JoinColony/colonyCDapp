import { ethers } from 'ethers';
import { TestContext } from 'yup';

import { intl } from '~utils/intl';

const { formatMessage } = intl({
  'rpc.invalid': 'RPC returned incorrect chain id ({chainId}). Expected {expectedChainId}',
});

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

async function validateCustomRPC(rpcURL: string, expectedChainId: string) {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  try {
    const chainId = await provider.send('net_version', []);
    if (chainId === expectedChainId) {
      return true;
    }
    return (this as TestContext).createError({
      message: formatMessage({ id: 'rpc.invalid' }, { expectedChainId, chainId }),
    });
  } catch (e) {
    return false;
  }
}

export async function validateCustomGnosisRPC(rpcURL: string) {
  return validateCustomRPC.call(this, rpcURL, '100');
}
