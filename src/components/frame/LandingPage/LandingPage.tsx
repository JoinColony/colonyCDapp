import { Keyhole, Plus } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { REQUEST_ACCESS } from '~constants';
import { LandingPageLayout } from '~frame/Extensions/layouts/LandingPageLayout.tsx';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

import ColonyCard from './ColonyCards/ColonyCard.tsx';
import CreateNewColonyCard from './ColonyCards/CreateNewColonyCard.tsx';
import ColonyInvitationBanner from './ColonyInvitationBanner.tsx';
import { useLandingPage } from './hooks.ts';
import InfoBanner from './InfoBanner/InfoBanner.tsx';
import LandingPageLoadingSkeleton from './LandingPageLoadingSkeleton.tsx';

const displayName = 'frame.LandingPage';

const MSG = defineMessages({
  createColonyTitle: {
    id: `${displayName}.createColonyTitle`,
    defaultMessage: 'Create a colony or share and invite others',
  },
  createColonyDescription: {
    id: `${displayName}.createColonyDescription`,
    defaultMessage:
      'As a part of the early access, creating a colony is limited to invites only. You can use the invites yourself or share with others.',
  },
  displayColoniesTitle: {
    id: `${displayName}.displayColoniesTitle`,
    defaultMessage: 'Explore your colonies',
  },
  displayColoniesDescription: {
    id: `${displayName}.displayColoniesDescription`,
    defaultMessage: 'View and navigate to your existing colonies.',
  },
  coloniesCardsTitle: {
    id: `${displayName}.coloniesCardsTitle`,
    defaultMessage: 'YOUR COLONIES',
  },
  connectWalletTitle: {
    id: `${displayName}.connectWalletTitle`,
    defaultMessage: 'Get started',
  },
  connectWalletDescription: {
    id: `${displayName}.connectWalletDescription`,
    defaultMessage:
      'Connect your wallet to sign in and check your access or return to your existing colonies.',
  },
  connectWalletButton: {
    id: `${displayName}.connectWalletButton`,
    defaultMessage: 'Connect wallet',
  },
  createColonyButton: {
    id: `${displayName}.createColonyButton`,
    defaultMessage: 'Create new Colony',
  },
  requestAccessButton: {
    id: `${displayName}.requestAccessButton`,
    defaultMessage: 'Request additional colonies',
  },
  noAccessTitle: {
    id: `${displayName}.noAccessTitle`,
    defaultMessage: 'Welcome to Colony',
  },
  noAccessDescription: {
    id: `${displayName}.noAccessDescription`,
    defaultMessage:
      'Tools to manage shared funds easily, openly, and securely.',
  },
  noAccessInfo: {
    id: `${displayName}.noAccessInfo`,
    defaultMessage:
      'Colony is currently in limited early access. Request access to get on the list and be among the first to try out the new platform.',
  },
  noAccessButton: {
    id: `${displayName}.noAccessButton`,
    defaultMessage: 'Request access',
  },
});

interface RightComponentProps {
  remainingInvitations: number;
  inviteLink: string;
}

const RightComponent = ({
  inviteLink,
  remainingInvitations,
}: RightComponentProps) => (
  <div className="w-full px-6 pt-8 md:w-auto">
    <div className="hidden max-w-[31.25rem] md:block">
      <h1 className="pb-2 heading-2">{formatText(MSG.createColonyTitle)}</h1>
      <p className="pb-14 text-md font-normal text-gray-600">
        {formatText(MSG.createColonyDescription)}
      </p>
    </div>
    <div>
      <h1 className="pb-2 heading-2 md:hidden">
        {formatText(MSG.displayColoniesTitle)}
      </h1>
      <p className="pb-[1.625rem] text-md font-normal text-gray-600 md:hidden">
        {formatText(MSG.displayColoniesDescription)}
      </p>
    </div>
    <div className="w-full">
      <ColonyInvitationBanner
        coloniesRemaining={remainingInvitations}
        inviteLink={inviteLink}
      />
    </div>
  </div>
);

interface BottomComponentProps {
  isWallet: boolean;
  canInteract: boolean;
  displayCreateButton: boolean;
  onConnectWallet: () => void;
  onCreateColony: () => void;
}

const BottomComponent = ({
  canInteract,
  displayCreateButton,
  isWallet,
  onConnectWallet,
  onCreateColony,
}: BottomComponentProps) => (
  <div className="w-full px-6 pb-6 md:hidden">
    {!isWallet ? (
      <Button isFullSize onClick={onConnectWallet}>
        {formatText(MSG.connectWalletButton)}
      </Button>
    ) : (
      <>
        {canInteract ? (
          <>
            {displayCreateButton && (
              <Button icon={Plus} isFullSize onClick={onCreateColony}>
                {formatText(MSG.createColonyButton)}
              </Button>
            )}
          </>
        ) : (
          <a href={REQUEST_ACCESS} target="_blank" rel="noreferrer">
            <Button isFullSize>{formatText(MSG.noAccessButton)}</Button>
          </a>
        )}
      </>
    )}
  </div>
);

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
            <div className="flex w-full flex-col justify-between">
              <div>
                <h1 className="pb-2 heading-2">
                  {formatText(MSG.connectWalletTitle)}
                </h1>
                <p className="text-md font-normal text-gray-600">
                  {formatText(MSG.connectWalletDescription)}
                </p>
              </div>
              <Button
                isFullSize
                className="mt-8 hidden md:block"
                onClick={connectWallet}
              >
                {formatText(MSG.connectWalletButton)}
              </Button>
            </div>
          ) : (
            <>
              {canInteract ? (
                <div className="h-full w-full md:max-h-[calc(100%-126px)] md:pt-0">
                  <div className="flex h-full flex-col justify-end ">
                    <h1 className="hidden pb-2 heading-2 md:block">
                      {formatText(MSG.displayColoniesTitle)}
                    </h1>
                    <p className="hidden text-md font-normal text-gray-600 md:block">
                      {formatText(MSG.displayColoniesDescription)}
                    </p>
                    <p className="pb-3 pt-[1.625rem] text-xs font-medium text-gray-400">
                      {formatText(MSG.coloniesCardsTitle)}
                    </p>
                    <div className="flex h-full flex-col gap-3 md:max-w-[440px] md:overflow-y-auto">
                      {availableColonies.length ? (
                        availableColonies.map(
                          ({
                            address,
                            avatar,
                            membersCount,
                            name,
                            displayName: colonyName,
                          }) => (
                            <Link to={`/${name}`} key={address}>
                              <ColonyCard
                                colonyAddress={address}
                                colonyAvatar={avatar}
                                colonyName={colonyName ?? ''}
                                membersCount={membersCount ?? 0}
                              />
                            </Link>
                          ),
                        )
                      ) : (
                        <CreateNewColonyCard
                          invitationsRemaining={remainingInvitations}
                          onCreate={onCreateColony}
                        />
                      )}
                    </div>
                    {hasShareableInvitationCode && (
                      <div className="hidden md:block">
                        <Button
                          icon={Plus}
                          isFullSize
                          className="mt-[1.875rem] md:mb-[3.125rem] md:max-w-[27.5rem]"
                          onClick={onCreateColony}
                        >
                          {formatText(MSG.createColonyButton)}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-col justify-between">
                  <div>
                    <h1 className="pb-2 heading-2">
                      {formatText(MSG.noAccessTitle)}
                    </h1>
                    <p className="pb-9 text-md font-normal text-gray-600 md:pb-8">
                      {formatText(MSG.noAccessDescription)}
                    </p>
                    <InfoBanner
                      icon={Keyhole}
                      title="Request early access"
                      text={formatText(MSG.noAccessInfo)}
                    />
                  </div>
                  <a href={REQUEST_ACCESS} target="_blank" rel="noreferrer">
                    <Button isFullSize className="mt-8 hidden md:block">
                      {formatText(MSG.noAccessButton)}
                    </Button>
                  </a>
                </div>
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
