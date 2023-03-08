import { getColonyNetworkClient, Network } from '@colony/colony-js';
import { useEffect, useState } from 'react';
import { providers } from 'ethers';

import {
  getReputationOracleURL,
  networkAddress,
} from '~redux/sagas/utils/getNetworkClient';
import { Address, Wallet } from '~types';

import useAppContext from './useAppContext';
import useColonyContext from './useColonyContext';

// TODO: Get this data from db once we have token data: https://github.com/JoinColony/colonyCDapp/issues/286

const getNetworkClient = (wallet: Wallet) => {
  const reputationOracleUrl = getReputationOracleURL();
  const walletProvider = new providers.Web3Provider(wallet.provider);
  const signer = walletProvider.getSigner();
  const networkClient = getColonyNetworkClient(Network.Custom, signer, {
    networkAddress,
    reputationOracleEndpoint: reputationOracleUrl.href,
  });

  return networkClient;
};

const getUserLock = async (
  tokenAddress: Address,
  userAddress: Address,
  wallet: Wallet,
) => {
  const networkClient = getNetworkClient(wallet);
  const tokenLockingClient = await networkClient.getTokenLockingClient();
  const userLock = await tokenLockingClient.getUserLock(
    tokenAddress,
    userAddress,
  );

  return userLock;
};

const useUserBalance = () => {
  const { colony } = useColonyContext();
  const { user, wallet } = useAppContext();

  const [userBalance, setUserBalance] = useState<string>();
  useEffect(() => {
    const getUserBalance = async (userWallet: Wallet) => {
      const userLock = await getUserLock(
        colony?.nativeToken.tokenAddress ?? '',
        user?.walletAddress ?? '',
        userWallet,
      );

      return userLock.balance.toString();
    };

    const storeUserBalance = async (userWallet: Wallet) => {
      const balance = await getUserBalance(userWallet);
      setUserBalance(balance);
    };

    if (wallet && user && colony) {
      storeUserBalance(wallet);
    }
  }, [wallet, colony, user]);

  return userBalance;
};

export default useUserBalance;
