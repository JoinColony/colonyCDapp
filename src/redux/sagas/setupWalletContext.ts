import { ContextModule, getContext, setContext } from '~context';
import { ColonyWallet } from '~types';
import { getLastWallet } from '~utils/autoLogin';

import { getBasicWallet, getWallet } from './wallet';

const setupWalletContext = async () => {
  let wallet: ColonyWallet | undefined;

  try {
    wallet = getContext(ContextModule.Wallet);
  } catch {
    // wallet not seen in context yet
  }

  const lastWallet = getLastWallet();

  if (!wallet && lastWallet) {
    // Perform quick "login"
    wallet = await getBasicWallet(lastWallet);
  } else {
    wallet = await getWallet(lastWallet);
  }

  setContext(ContextModule.Wallet, wallet);

  return wallet;
};

export default setupWalletContext;
