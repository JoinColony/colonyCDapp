import { Confetti, Password } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { REQUEST_ACCESS } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { LandingPageLayout } from '~frame/Extensions/layouts/LandingPageLayout.tsx';
import InfoBanner from '~frame/LandingPage/InfoBanner/InfoBanner.tsx';
import {
  useGetColonyMemberInviteQuery,
  useValidateUserInviteMutation,
  useGetPublicColonyByNameQuery,
} from '~gql';
import useIsContributor from '~hooks/useIsContributor.ts';
import { CREATE_PROFILE_ROUTE, NOT_FOUND_ROUTE } from '~routes/index.ts';
import { formatText } from '~utils/intl.ts';
import PageLoader from '~v5/common/PageLoader/index.ts';
import Button from '~v5/shared/Button/index.ts';

const displayName = 'pages.ColonyPreviewPage';

const MSG = defineMessages({
  loadingMessage: {
    id: `${displayName}.loadingMessage`,
    defaultMessage: 'Checking your access...',
  },
  title: {
    id: `${displayName}.title`,
    defaultMessage: `Welcome to Colony`,
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
});

const ColonyPreviewPage = () => {
  const { inviteCode = '', colonyName = '' } = useParams<{
    inviteCode: string;
    colonyName: string;
  }>();
  const { pathname } = useLocation();
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
    return <PageLoader loadingText={formatMessage(MSG.loadingMessage)} />;
  }

  if (wallet && !user) {
    return (
      <Navigate to={CREATE_PROFILE_ROUTE} state={{ redirectTo: pathname }} />
    );
  }

  if (isContributor) {
    return <Navigate to={`/${colonyName}`} />;
  }

  if (!colonyAddress) {
    return <Navigate to={NOT_FOUND_ROUTE} />;
  }

  const inviteIsValid =
    inviteData?.getColonyMemberInvite &&
    inviteData.getColonyMemberInvite.invitesRemaining > 0 &&
    inviteData.getColonyMemberInvite.colony.name === colonyName;
  const inviteIsInvalid = inviteCode && !inviteIsValid;
  const colonyDisplayName =
    colonyData?.getColonyByName?.items[0]?.metadata?.displayName || colonyName;

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
            <h1 className="heading-2">{formatText(MSG.title)}</h1>
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
