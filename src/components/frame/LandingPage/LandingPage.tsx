import clsx from 'clsx';
import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { LandingPageLayout } from '~frame/Extensions/layouts/LandingPageLayout.tsx';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';

import { useLandingPage } from './hooks.ts';
import BottomComponent from './partials/BottomComponent/BottomComponent.tsx';
import LandingPageLoadingSkeleton from './partials/LandingPageLoadingSkeleton/LandingPageLoadingSkeleton.tsx';
import NoAccessContent from './partials/NoAccessContent/NoAccessContent.tsx';
import NoWalletContent from './partials/NoWalletContent/NoWalletContent.tsx';
import RightComponent from './partials/RightComponent/RightComponent.tsx';
import WalletConnectedContent from './partials/WalletConnectedContent/WalletConnectedContent.tsx';

const displayName = 'frame.LandingPage';

const LandingPage = () => {
  const {
    availableColonies,
    canInteract,
    connectWallet,
    inviteLink,
    isLoading,
    isContentLoading,
    onCreateColony,
    remainingInvitations,
    wallet,
    hasShareableInvitationCode,
    hasWalletConnected,
  } = useLandingPage();

  if (isLoading) {
    return <LoadingTemplate />;
  }

  return (
    <LandingPageLayout
      rightComponent={
        canInteract ? (
          <RightComponent
            inviteLink={inviteLink}
            remainingInvitations={remainingInvitations}
          />
        ) : undefined
      }
      bottomComponent={
        isContentLoading ? (
          <LoadingSkeleton
            isLoading
            className="m-6 h-[2.125rem] w-full rounded md:hidden"
          />
        ) : (
          <BottomComponent
            canInteract={canInteract}
            displayCreateButton={
              hasShareableInvitationCode && !!availableColonies.length
            }
            isWallet={!!wallet}
            onConnectWallet={connectWallet}
            onCreateColony={onCreateColony}
          />
        )
      }
    >
      {isContentLoading ? (
        <LandingPageLoadingSkeleton loadingCards={hasWalletConnected} />
      ) : (
        <div
          className={clsx('flex h-full px-6 pb-0 md:px-0', {
            'md:items-center md:pb-24': !canInteract,
            'md:items-end': canInteract,
          })}
        >
          {!wallet ? (
            <NoWalletContent connectWallet={connectWallet} />
          ) : (
            <>
              {canInteract ? (
                <WalletConnectedContent
                  availableColonies={availableColonies}
                  onCreateColony={onCreateColony}
                  hasShareableInvitationCode={hasShareableInvitationCode}
                  remainingInvitations={remainingInvitations}
                />
              ) : (
                <NoAccessContent />
              )}
            </>
          )}
        </div>
      )}
    </LandingPageLayout>
  );
};

LandingPage.displayName = displayName;

export default LandingPage;
