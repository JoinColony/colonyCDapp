import { HandsClapping, HandWaving } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import {
  useGetColonyMemberInviteQuery,
  useValidateUserInviteMutation,
  useGetPublicColonyByNameQuery,
} from '~gql';
import useIsContributor from '~hooks/useIsContributor.ts';
import { CREATE_PROFILE_ROUTE, NOT_FOUND_ROUTE } from '~routes/index.ts';
import PageLoader from '~v5/common/PageLoader/index.ts';
import Button from '~v5/shared/Button/index.ts';
import CardConnectWallet from '~v5/shared/CardConnectWallet/index.ts';
import CardWithCallout from '~v5/shared/CardWithCallout/index.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';
import SocialLinks from '~v5/shared/SocialLinks/index.ts';

const displayName = 'pages.ColonyPreviewPage';

const MSG = defineMessages({
  loadingMessage: {
    id: `${displayName}.loadingMessage`,
    defaultMessage: 'Checking your access...',
  },
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Welcome to Colony’s private beta',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'The Colony app is in private beta, allowing invited members and Colony’s to test out the new features before launch.',
  },
  notificationBannerTitle: {
    id: `${displayName}.notificationBannerTitle`,
    defaultMessage:
      'You have been invited to join {colonyName} for the private beta.',
  },
  invalidBannerTitle: {
    id: `${displayName}.invalidBannerTitle`,
    defaultMessage: 'Sorry, your invite code is not valid. Please check again.',
  },
  privateAccessHeading: {
    id: `${displayName}.privateAccessHeading`,
    defaultMessage: 'Private access only',
  },
  restrictedAccessMessage: {
    id: `${displayName}.restrictedAccessMessage`,
    /* eslint-disable max-len */
    defaultMessage: `
    This Colony has restricted access during the private beta test. Only members who have been invited can access the Colony.
      {needsToRequestAccess, select,
      true {To request access to this Colony, you can contact them via their social accounts above.}
      other {}
    }`,
    /* eslint-enable max-len */
  },
  joinColonyButton: {
    id: `${displayName}.joinColonyButton`,
    defaultMessage: 'Join the Colony',
  },
  connectWalletTitle: {
    id: `${displayName}.connectWalletTitle`,
    defaultMessage: 'Connect your wallet to check your access',
  },
  connectWalletText: {
    id: `${displayName}.connectWalletText`,
    defaultMessage: 'You might have private beta access already available.',
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
  const colonyMetadata = colonyData?.getColonyByName?.items[0]?.metadata;

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
  const socialLinks =
    colonyData?.getColonyByName?.items[0]?.metadata?.externalLinks || [];

  return (
    <div className="mx-auto max-w-[34rem]">
      <h1 className="mb-2 text-2xl font-semibold">
        <FormattedMessage {...MSG.heading} />
      </h1>
      <p className="mb-5 text-sm text-gray-600">
        <FormattedMessage {...MSG.description} />
      </p>
      <hr className="mb-8" />
      {inviteIsValid && (
        <NotificationBanner
          icon={HandsClapping}
          status="success"
          className="my-8"
        >
          {formatMessage(MSG.notificationBannerTitle, {
            colonyName: colonyDisplayName,
          })}
        </NotificationBanner>
      )}
      {inviteIsInvalid && (
        <NotificationBanner icon={HandWaving} status="error" className="my-8">
          {formatMessage(MSG.invalidBannerTitle)}
        </NotificationBanner>
      )}
      {wallet ? null : (
        <CardConnectWallet
          connectWallet={connectWallet}
          title={formatMessage(MSG.connectWalletTitle)}
          text={formatMessage(MSG.connectWalletText)}
        />
      )}
      <h2 className="mb-3 mt-8 text-md font-semibold">
        <FormattedMessage {...MSG.privateAccessHeading} />
      </h2>
      <CardWithCallout
        className="border-grey-200"
        button={
          user && inviteIsValid ? (
            <Button
              className="w-full md:w-auto"
              mode="quinary"
              text={MSG.joinColonyButton}
              onClick={() => validateInviteCode()}
              size="small"
            />
          ) : null
        }
        title={
          <div className="flex w-full flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4">
            <ColonyAvatar
              colonyImageSrc={
                colonyMetadata?.thumbnail || colonyMetadata?.avatar || undefined
              }
              colonyAddress={colonyAddress || ADDRESS_ZERO}
              colonyName={colonyDisplayName}
              size={24}
            />
            <h1 className="inline text-md font-medium">{colonyDisplayName}</h1>
            <SocialLinks
              className="w-full sm:ml-auto sm:w-auto"
              externalLinks={socialLinks}
            />
          </div>
        }
      >
        <FormattedMessage
          {...MSG.restrictedAccessMessage}
          values={{
            needsToRequestAccess: !!(!inviteIsValid && socialLinks.length),
          }}
        />
      </CardWithCallout>
    </div>
  );
};

ColonyPreviewPage.displayName = displayName;

export default ColonyPreviewPage;
