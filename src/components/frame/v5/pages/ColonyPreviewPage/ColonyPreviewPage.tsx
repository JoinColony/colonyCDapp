import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import NotificationBanner from '~v5/shared/NotificationBanner';
import CardWithCallout from '~v5/shared/CardWithCallout';
import Spinner from '~v5/shared/Spinner';
import Button from '~v5/shared/Button';
import { useAppContext } from '~hooks';
import {
  useGetColonyMemberInviteQuery,
  useGetColonyWhitelistByNameQuery,
  useValidateUserInviteMutation,
  useGetPublicColonyByNameQuery,
} from '~gql';
import { CREATE_PROFILE_ROUTE } from '~routes';
import ColonyAvatar from '~v5/shared/ColonyAvatar';
import SocialLinks from '~v5/shared/SocialLinks';
import CardConnectWallet from '~v5/shared/CardConnectWallet';

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

  // @TODO: This is terrible. Once we have auth, we need a method
  // to check whether the logged in user is a member of the Colony
  const { data: whitelistData, loading: whitelistLoading } =
    useGetColonyWhitelistByNameQuery({
      variables: { name: colonyName },
    });

  const { data: colonyData, loading: colonyLoading } =
    useGetPublicColonyByNameQuery({
      variables: { name: colonyName },
      skip: !colonyName,
    });

  const [validate] = useValidateUserInviteMutation();

  const colonyAddress = colonyData?.getColonyByName?.items[0]?.colonyAddress;
  const colonyMetadata = colonyData?.getColonyByName?.items[0]?.metadata;

  const validateInviteCode = useCallback(async () => {
    if (!colonyAddress || !inviteCode || !wallet) return;
    const valid = await validate({
      variables: {
        input: { colonyAddress, inviteCode, userAddress: wallet.address },
      },
    });

    if (valid.data?.validateUserInvite) {
      navigate(`/${colonyName}`);
    }
  }, [colonyName, colonyAddress, wallet, validate, navigate, inviteCode]);

  if (
    userLoading ||
    walletConnecting ||
    inviteLoading ||
    whitelistLoading ||
    colonyLoading
  ) {
    return <Spinner loading loadingText={MSG.loadingMessage} />;
  }

  if (wallet && !user) {
    return (
      <Navigate to={CREATE_PROFILE_ROUTE} state={{ redirectTo: pathname }} />
    );
  }

  const isMember = !!whitelistData?.getColonyByName?.items[0]?.whitelist.some(
    (addr) => addr === user?.walletAddress,
  );

  if (isMember) {
    return <Navigate to={`/${colonyName}`} />;
  }

  const inviteIsValid =
    !!inviteData?.getColonyMemberInvite?.valid &&
    inviteData.getColonyMemberInvite.invitesRemaining > 0 &&
    inviteData.getColonyMemberInvite.colony.name === colonyName;
  const inviteIsInvalid = inviteCode && !inviteIsValid;
  const colonyDisplayName =
    colonyData?.getColonyByName?.items[0]?.metadata?.displayName || colonyName;
  const socialLinks =
    colonyData?.getColonyByName?.items[0]?.metadata?.externalLinks || [];

  return (
    <div className="max-w-[34rem] mx-auto">
      <h1 className="text-2xl mb-2 font-semibold">
        <FormattedMessage {...MSG.heading} />
      </h1>
      <p className="text-sm mb-5 text-gray-600">
        <FormattedMessage {...MSG.description} />
      </p>
      <hr className="mb-8" />
      {inviteIsValid && (
        <NotificationBanner
          icon="hands-clapping"
          status="success"
          className="my-8"
        >
          {formatMessage(MSG.notificationBannerTitle, {
            colonyName: colonyDisplayName,
          })}
        </NotificationBanner>
      )}
      {inviteIsInvalid && (
        <NotificationBanner icon="hand-waving" status="error" className="my-8">
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
      <h2 className="text-md font-semibold mt-8 mb-3">
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
          <div className="flex items-center gap-4 w-full">
            <ColonyAvatar
              colonyImageProps={
                colonyMetadata?.avatar
                  ? {
                      src: colonyMetadata?.thumbnail || colonyMetadata?.avatar,
                    }
                  : undefined
              }
              size="mediumSmallMediumLargeSmallTinyBigMediumLargeSmall"
            />
            <h1 className="text-md font-medium inline">{colonyDisplayName}</h1>
            <SocialLinks className="ml-auto" externalLinks={socialLinks} />
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
