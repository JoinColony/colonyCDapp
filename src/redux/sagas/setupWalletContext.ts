import { ContextModule, getContext, setContext } from '~context';
import { ColonyWallet } from '~types';
import { getLastWallet, setLastWallet } from '~utils/autoLogin';
import { createAddress } from '~utils/web3';

import { getBasicWallet, getWallet } from './wallet';
import { disconnectWallet } from './users';

const ONBOARD_METAMASK_WALLET_LABEL = 'MetaMask';

const getMetamaskAddress = () => {
  // try/catch just in case createAddress errors
  try {
    if (window.ethereum) {
      return createAddress(
        // @ts-ignore
        window.ethereum.selectedAddress,
      );
    }
  } catch {
    // silent
  }
  return undefined;
};

const setupWalletContext = async () => {
  let wallet: ColonyWallet | undefined;

  try {
    wallet = getContext(ContextModule.Wallet);

    const selectedMetamaskAddress = getMetamaskAddress();
    /*
     * If the wallet we've pulled from context does not have the same address as the selected account
     * in Metamask, it's because the user just switched their account in metamask.
     */
    if (selectedMetamaskAddress && wallet.address !== selectedMetamaskAddress) {
      disconnectWallet(wallet.label); // disconnect previous wallet

      // replace it in local storage with the wallet the user switched to
      setLastWallet({
        type: ONBOARD_METAMASK_WALLET_LABEL,
        address: selectedMetamaskAddress,
      });

      wallet = undefined;
    }
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
