import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import NotificationBanner from '~common/Extensions/NotificationBanner';
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
  connectWalletTitle: {
    id: `${displayName}.connectWalletTitle`,
    defaultMessage: 'Connect your wallet to check your accesss',
  },
  connectWalletSubtitle: {
    id: `${displayName}.connectWalletSubtitle`,
    defaultMessage: 'You might have private beta access already available.',
  },
  notificationBannerTitle: {
    id: `${displayName}.notificationBannerTitle`,
    defaultMessage:
      'You have been invited to join {colonyName} for the private beta.',
  },
  invalidBannerTitle: {
    id: `${displayName}.invalidBannerTitle`,
    defaultMessage: 'The invite code is invalid',
  },
  connectWalletButton: {
    id: `${displayName}.connectWalletButton`,
    defaultMessage: 'Connect wallet',
  },
  requestAccessHeading: {
    id: `${displayName}.connectWalletButton`,
    defaultMessage: 'Request access',
  },
  privateAccessHeading: {
    id: `${displayName}.privateAccessHeading`,
    defaultMessage: 'Private access only',
  },
  restrictedAccessMessage: {
    id: `${displayName}.restrictedAccessMessage`,
    defaultMessage:
      'This Colony has restricted access during the private beta test. Only members who have been invited can access the Colony during this time. To request access to this Colony, you can contact them via their social accounts above.',
  },
  joinColonyButton: {
    id: `${displayName}.joinColonyButton`,
    defaultMessage: 'Join the Colony',
  },
});

const ColonyPreviewPage = () => {
  const { inviteCode = '', colonyName = '' } = useParams<{
    inviteCode: string;
    colonyName: string;
  }>();
  const { formatMessage } = useIntl();
  const { connectWallet, user, userLoading, walletConnecting } =
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

  const validateAndRedirect = useCallback(async () => {
    if (!colonyAddress || !inviteCode || !user?.walletAddress) return;
    const valid = await validate({
      variables: {
        input: { colonyAddress, inviteCode, userAddress: user.walletAddress },
      },
    });
    if (valid.data?.validateUserInvite) {
      navigate(`/colony/${colonyName}`);
    }
  }, [colonyName, colonyAddress, user, validate, navigate, inviteCode]);

  if (
    userLoading ||
    walletConnecting ||
    inviteLoading ||
    whitelistLoading ||
    colonyLoading
  ) {
    return <Spinner loading loadingText={MSG.loadingMessage} />;
  }

  const isMember = !!whitelistData?.getColonyByName?.items[0]?.whitelist.some(
    (addr) => addr === user?.walletAddress,
  );

  if (isMember) {
    return <Navigate to={`/colony/${colonyName}`} />;
  }

  const inviteIsValid =
    inviteData?.getColonyMemberInvite?.valid &&
    inviteData.getColonyMemberInvite.invitesRemaining > 0 &&
    inviteData.getColonyMemberInvite.colony.name === colonyName;
  const inviteIsInvalid = inviteCode && !inviteIsValid;
  const colonyDisplayName =
    colonyData?.getColonyByName?.items[0]?.metadata?.displayName || colonyName;

  return (
    <div className="max-w-[34rem] mx-auto">
      <h1 className="text-2xl mb-2 font-semibold">
        <FormattedMessage {...MSG.heading} />
      </h1>
      <p className="text-sm mb-5">
        <FormattedMessage {...MSG.description} />
      </p>
      <hr />
      {inviteIsValid && (
        <NotificationBanner
          iconName="hands-clapping"
          status="success"
          className="my-8"
          title={formatMessage(MSG.notificationBannerTitle, {
            colonyName: colonyDisplayName,
          })}
        />
      )}
      {inviteIsInvalid && (
        <NotificationBanner
          iconName="thumbs-down"
          status="error"
          className="my-8"
          title={formatMessage(MSG.invalidBannerTitle)}
        />
      )}
      {user ? null : (
        <CardWithCallout
          button={
            <Button
              className="w-full md:w-auto"
              mode="quinary"
              iconName="cardholder"
              text={MSG.connectWalletButton}
              onClick={connectWallet}
              size="small"
            />
          }
          iconName="plugs"
          subtitle={<FormattedMessage {...MSG.connectWalletTitle} />}
        >
          <FormattedMessage {...MSG.connectWalletSubtitle} />
        </CardWithCallout>
      )}
      <h2 className="text-md font-semibold mt-8 mb-3">
        <FormattedMessage
          {...(inviteIsValid
            ? MSG.privateAccessHeading
            : MSG.requestAccessHeading)}
        />
      </h2>
      <CardWithCallout
        className="border-grey-200"
        button={
          inviteIsValid ? (
            <Button
              className="w-full md:w-auto"
              mode="quinary"
              text={MSG.joinColonyButton}
              onClick={validateAndRedirect}
              size="small"
            />
          ) : null
        }
        iconName="lock"
        title={colonyDisplayName}
      >
        <FormattedMessage {...MSG.restrictedAccessMessage} />
      </CardWithCallout>
    </div>
  );
};

ColonyPreviewPage.displayName = displayName;

export default ColonyPreviewPage;
