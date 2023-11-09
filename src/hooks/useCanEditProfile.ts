import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { LANDING_PAGE_ROUTE } from '~routes';
import { getLastWallet } from '~utils/autoLogin';
import { useAppContext } from '~hooks';

const useCanEditProfile = () => {
  const { user, userLoading, walletConnecting, updateUser, wallet } =
    useAppContext();

  const navigate = useNavigate();
  // If there's a last wallet label, it means we're logged in.
  // If null, we're logged out and should be redirected to landing page.
  const lastWalletLabel = getLastWallet();
  const { state: locationState } = useLocation();
  const isRedirect = locationState?.isRedirect;

  useEffect(() => {
    if (isRedirect && updateUser) {
      updateUser(wallet?.address, true);
    }
  }, [isRedirect, updateUser, wallet]);

  useEffect(() => {
    // cannot edit profile if we're logged out or no there's no registered user in db.
    if (
      ((lastWalletLabel === null || user === null) && !isRedirect) ||
      !wallet
    ) {
      navigate(LANDING_PAGE_ROUTE);
    }
  }, [user, lastWalletLabel, navigate, isRedirect, wallet]);

  return {
    loadingProfile: userLoading || walletConnecting,
    user,
  };
};

export default useCanEditProfile;
