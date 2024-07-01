import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext.tsx';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/index.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { LANDING_PAGE_ROUTE } from '~routes/index.ts';
import { isFullWallet } from '~types/wallet.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';

const displayName = 'v5.pages.UserProfileExperimentalPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading...',
  },
});

const UserAdvancedPage = () => {
  const { user, userLoading, wallet, walletConnecting } = useAppContext();
  const { formatMessage } = useIntl();

  useSetPageHeadingTitle(formatText({ id: 'userProfile.title' }));

  if (userLoading || walletConnecting) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  const handleAddNetwork = () => {
    if (isFullWallet(wallet)) {
      wallet.provider
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x64',
              chainName: 'Gnosis (via Colony RPC)',
              rpcUrls: ['https://app.colony.io/rpc/'],
              nativeCurrency: {
                decimals: 18,
                symbol: 'XDAI',
                name: 'XDai Token',
              },
              blockExplorerUrls: ['https://gnosisscan.io'],
            },
          ],
        })
        .catch((error) => {
          console.error('User rehjected adding the network', error);
        });
    } else {
      console.error('Wallet not full!');
    }
  };

  const handleSwitchNetwork = () => {
    if (isFullWallet(wallet)) {
      wallet.provider
        .request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: '0x64',
            },
          ],
        })
        .catch((error) => {
          console.error('User rehjected switching the network', error);
        });
    } else {
      console.error('Wallet not full!');
    }
  };

  /*
   * Plance all your user related experimental components here
   */
  return (
    <div className="flex flex-col gap-6">
      <h4 className="heading-4">
        {formatMessage({ id: 'experimentalSettings.title' })}
      </h4>
      <div className="flex items-center">
        <Button
          className="mr-4"
          mode="primarySolid"
          text="Add Gnosis Network"
          onClick={handleAddNetwork}
        />
        <Button
          mode="primarySolid"
          text="Switch to Gnosis Network"
          onClick={handleSwitchNetwork}
        />
      </div>
    </div>
  );
};

UserAdvancedPage.displayName = displayName;

export default UserAdvancedPage;
