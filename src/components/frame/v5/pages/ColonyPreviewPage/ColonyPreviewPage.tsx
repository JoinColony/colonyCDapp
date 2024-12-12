import { Confetti, Password } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Flow } from '~common/Onboarding/types.ts';
import { ADDRESS_ZERO, REQUEST_ACCESS } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { LandingPageLayout } from '~frame/Extensions/layouts/LandingPageLayout.tsx';
import InfoBanner from '~frame/LandingPage/partials/InfoBanner/InfoBanner.tsx';
import LoadingTemplate from '~frame/LoadingTemplate/LoadingTemplate.tsx';
import OnboardingPage from '~frame/v5/pages/OnboardingPage/index.ts';
import {
  useGetColonyMemberInviteQuery,
  useValidateUserInviteMutation,
  useGetPublicColonyByNameQuery,
} from '~gql';
import useIsContributor from '~hooks/useIsContributor.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';
import CardWithCallout from '~v5/shared/CardWithCallout/CardWithCallout.tsx';
import ColonyAvatar from '~v5/shared/ColonyAvatar/ColonyAvatar.tsx';
import SocialLinks from '~v5/shared/SocialLinks/SocialLinks.tsx';

const displayName = 'pages.ColonyPreviewPage';

const MSG = defineMessages({
  loadingMessage: {
    id: `${displayName}.loadingMessage`,
    defaultMessage: 'Checking your access...',
  },
  title: {
    id: `${displayName}.title`,
    defaultMessage: `
    {noWallet, select,
    true {Get started}
    other {Welcome to Colony}
  }`,
  },
  info: {
    id: `${displayName}.info`,
    defaultMessage: `
      {noWallet, select,
      true {Connect your wallet to sign in and check your access or return to your existing colonies.}
      other {Tools to manage shared funds easily, openly, and securely.}
    }`,
  },
  connectWalletButton: {
    id: `${displayName}.connectWalletButton`,
    defaultMessage: `Connect wallet`,
  },
  joinColonyButton: {
    id: `${displayName}.joinColonyButton`,
    defaultMessage: `Join the colony`,
  },
  requestAccessButton: {
    id: `${displayName}.requestAccessButton`,
    defaultMessage: `Request access`,
  },
  infoBannerTitle: {
    id: `${displayName}.infoBannerTitle`,
    defaultMessage: `
      {needsToRequestAccess, select,
      true {Invalid colony invite code}
      other {You’ve been invited!}
    }`,
  },
  infoBannerDescription: {
    id: `${displayName}.infoBannerDescription`,
    defaultMessage: `
      {needsToRequestAccess, select,
      true {Your invite code to {colony} is not valid. Please check the code and try again.}
      other {You’ve been invited to join the {colony}. Connect your wallet below to join the colony!}
    }`,
  },
  restrictedAccessMessage: {
    id: `${displayName}.restrictedAccessMessage`,
    defaultMessage: `This Colony has restricted access during early access. Only members who have been invited can access the Colony.`,
  },
});

const ColonyPreviewPage = () => {
  const { inviteCode = '', colonyName = '' } = useParams<{
    inviteCode: string;
    colonyName: string;
  }>();
  const { formatMessage } = useIntl();
  const { connectWallet, wallet, user, userLoading, walletConnecting } =
    useAppContext();

  const navigate = useNavigate();

  const { data: inviteData, loading: inviteLoading } =
    useGetColonyMemberInviteQuery({
      variables: { id: inviteCode },
      skip: !inviteCode,
    });

  const { data: colonyData, loading: colonyLoading } =
    useGetPublicColonyByNameQuery({
      variables: { name: colonyName },
      skip: !colonyName,
    });

  const [validate] = useValidateUserInviteMutation();

  const colonyAddress = colonyData?.getColonyByName?.items[0]?.colonyAddress;

  const { isContributor, loading: isContributorLoading } = useIsContributor({
    colonyAddress,
    walletAddress: user?.walletAddress,
  });

  const validateInviteCode = async () => {
    if (!colonyAddress || !inviteCode || !wallet) return;
    const valid = await validate({
      variables: {
        input: { colonyAddress, inviteCode, userAddress: wallet.address },
      },
    });

    if (valid.data?.validateUserInvite) {
      navigate(`/${colonyName}`);
    }
  };

  if (
    userLoading ||
    walletConnecting ||
    inviteLoading ||
    isContributorLoading ||
    colonyLoading
  ) {
    return <LoadingTemplate loadingText={formatMessage(MSG.loadingMessage)} />;
  }

  if (wallet && !user) {
    return <OnboardingPage flow={Flow.User} />;
  }

  if (isContributor) {
    return <Navigate to={`/${colonyName}`} />;
  }

  const inviteIsValid =
    inviteData?.getColonyMemberInvite &&
    inviteData.getColonyMemberInvite.invitesRemaining > 0 &&
    inviteData.getColonyMemberInvite.colony.name === colonyName;
  const inviteIsInvalid = inviteCode && !inviteIsValid;
  const colonyDisplayName =
    colonyData?.getColonyByName?.items[0]?.metadata?.displayName || colonyName;
  const colonyMetadata = colonyData?.getColonyByName?.items[0]?.metadata;
  const socialLinks =
    colonyData?.getColonyByName?.items[0]?.metadata?.externalLinks || [];

  return (
    <LandingPageLayout
      bottomComponent={
        <div className="w-full px-6 pb-6 md:hidden">
          {!wallet ? (
            <Button isFullSize onClick={connectWallet}>
              {formatText(MSG.connectWalletButton)}
            </Button>
          ) : (
            <>
              {inviteIsValid && (
                <Button isFullSize onClick={validateInviteCode}>
                  {formatText(MSG.joinColonyButton)}
                </Button>
              )}
              {inviteIsInvalid && (
                <a href={REQUEST_ACCESS} target="_blank" rel="noreferrer">
                  <Button isFullSize>
                    {formatText(MSG.requestAccessButton)}
                  </Button>
                </a>
              )}
            </>
          )}
        </div>
      }
    >
      <div className="flex h-full items-center px-8 md:px-0">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="heading-2">
              {formatText(MSG.title, { noWallet: !wallet })}
            </h1>
            <p
              className={clsx(
                'pt-2 text-md font-normal text-gray-600 md:block',
                {
                  hidden: inviteIsValid && !wallet,
                },
              )}
            >
              {formatText(MSG.info, {
                noWallet: !wallet && inviteIsInvalid,
              })}
            </p>
            <div className="pt-9 md:pt-8">
              {inviteCode ? (
                <InfoBanner
                  icon={inviteIsValid ? Confetti : Password}
                  title={formatText(MSG.infoBannerTitle, {
                    needsToRequestAccess: inviteIsInvalid,
                  })}
                  text={formatText(MSG.infoBannerDescription, {
                    needsToRequestAccess: inviteIsInvalid,
                    colony: (
                      <span className="font-bold">{colonyDisplayName}</span>
                    ),
                  })}
                  variant={inviteIsValid ? 'success' : 'error'}
                />
              ) : (
                <CardWithCallout
                  className="border-grey-200"
                  title={
                    <div className="flex w-full flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4">
                      <ColonyAvatar
                        colonyImageSrc={
                          colonyMetadata?.thumbnail ||
                          colonyMetadata?.avatar ||
                          undefined
                        }
                        colonyAddress={colonyAddress || ADDRESS_ZERO}
                        colonyName={colonyDisplayName}
                        size={24}
                      />
                      <h1 className="inline text-md font-medium">
                        {colonyDisplayName}
                      </h1>
                    </div>
                  }
                >
                  {formatText(MSG.restrictedAccessMessage)}

                  <SocialLinks
                    className="mt-3.5 w-full sm:ml-auto sm:w-auto"
                    externalLinks={socialLinks}
                  />
                </CardWithCallout>
              )}
            </div>
          </div>
          <div className="hidden w-full md:block">
            {!wallet ? (
              <Button isFullSize onClick={connectWallet}>
                {formatText(MSG.connectWalletButton)}
              </Button>
            ) : (
              <>
                {inviteIsValid && (
                  <Button isFullSize onClick={validateInviteCode}>
                    {formatText(MSG.joinColonyButton)}
                  </Button>
                )}
                {inviteIsInvalid && (
                  <a href={REQUEST_ACCESS} target="_blank" rel="noreferrer">
                    <Button isFullSize>
                      {formatText(MSG.requestAccessButton)}
                    </Button>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </LandingPageLayout>
  );
};

ColonyPreviewPage.displayName = displayName;

export default ColonyPreviewPage;
