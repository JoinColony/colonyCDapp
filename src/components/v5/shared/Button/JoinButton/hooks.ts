import { useState, useEffect } from 'react';
import { useAppContext } from '~hooks';
import useColonySubscription from '~hooks/useColonySubscription';

export const useShowJoinColonyButton = () => {
  const { wallet, user, walletConnecting, userLoading } = useAppContext();
  const { canWatch } = useColonySubscription();

  const noRegisteredUser = !user && !userLoading;
  const noWalletConnected = !wallet && !walletConnecting;

  const initialShowJoinButton =
    canWatch || noWalletConnected || noRegisteredUser;

  const [showJoinButton, setShowJoinButton] = useState(initialShowJoinButton);

  useEffect(() => {
    if (!initialShowJoinButton) {
      return;
    }

    setShowJoinButton(true);
  }, [initialShowJoinButton]);

  return {
    showJoinButton,
    setShowJoinButton,
    noRegisteredUser,
    noWalletConnected,
  };
};
