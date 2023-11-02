import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import CardWithCallout from '~v5/shared/CardWithCallout/CardWithCallout';
import Spinner from '~v5/shared/Spinner';
import Button from '~v5/shared/Button';
import { useAppContext } from '~hooks';
import {
  useGetColonyMemberInviteQuery,
  useGetColonyWhitelistByNameQuery,
  useValidateUserInviteMutation,
  useGetPublicColonyByNameQuery,
} from '~gql';

const MSG = defineMessages({
  loadingMessage: {
    id: 'ColonyInvitePage.loadingMessage',
    defaultMessage: 'Checking your access...',
  },
  heading: {
    id: 'ColonyInvitePage.heading',
    defaultMessage: 'Welcome to Colony’s private beta',
  },
  description: {
    id: 'ColonyInvitePage.description',
    defaultMessage:
      'The Colony app is in private beta, allowing invited members and Colony’s to test out the new features before launch.',
  },
  connectWalletTitle: {
    id: 'ColonyInvitePage.connectWalletTitle',
    defaultMessage: 'Connect your wallet to check your accesss',
  },
  connectWalletSubtitle: {
    id: 'ColonyInvitePage.connectWalletSubtitle',
    defaultMessage: 'You might have private beta access already available.',
  },
  notificationBannerTitle: {
    id: 'ColonyInvitePage.notificationBannerTitle',
    defaultMessage:
      'You have been invited to join {colonyName} for the private beta.',
  },
  connectWalletButton: {
    id: 'ColonyInvitePage.connectWalletButton',
    defaultMessage: 'Connect wallet',
  },
  requestAccessHeading: {
    id: 'ColonyInvitePage.connectWalletButton',
    defaultMessage: 'Request access',
  },
  privateAccessHeading: {
    id: 'ColonyInvitePage.privateAccessHeading',
    defaultMessage: 'Private access only',
  },
  restrictedAccessMessage: {
    id: 'ColonyInvitePage.restrictedAccessMessage',
    defaultMessage:
      'This Colony has restricted access during the private beta test. Only members who have been invited can access the Colony during this time. To request access to this Colony, you can contact them via their social accounts above.',
  },
  joinColonyButton: {
    id: 'ColonyInvitePage.joinColonyButton',
    defaultMessage: 'Join the Colony',
  },
});

const displayName = 'pages.ColonyPreviewPage';

const ColonyPreviewPage = () => {
  const { inviteCode = '', colonyName = '' } = useParams<{
    inviteCode: string;
    colonyName: string;
  }>();
  const { formatMessage } = useIntl();
  const { connectWallet, user } = useAppContext();

  const navigate = useNavigate();

  const { data: dataInvite, loading: loadingInvite } =
    useGetColonyMemberInviteQuery({
      variables: { id: inviteCode },
      skip: !inviteCode,
    });

  // @TODO: This is terrible. Once we have auth, we need a method
  // to check whether the logged in user is a member of the Colony
  const { data: dataWhitelist, loading: loadingWhitelist } =
    useGetColonyWhitelistByNameQuery({
      variables: { name: colonyName },
    });

  const { data: dataColony, loading: loadingColony } =
    useGetPublicColonyByNameQuery({
      variables: { name: colonyName },
      skip: !colonyName,
    });

  const [validate] = useValidateUserInviteMutation();

  const colonyAddress = dataColony?.getColonyByName?.items[0]?.colonyAddress;

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

  if (loadingInvite || loadingWhitelist || loadingColony) {
    return <Spinner loading loadingText={MSG.loadingMessage} />;
  }

  const isMember = !!dataWhitelist?.getColonyByName?.items[0]?.whitelist.some(
    (addr) => addr === user?.walletAddress,
  );

  if (isMember) {
    navigate(`/colony/${colonyName}`);
    return null;
  }

  const inviteIsValid = !!dataInvite?.getColonyMemberInvite?.valid;
  const colonyDisplayName =
    dataColony?.getColonyByName?.items[0]?.metadata?.displayName || colonyName;

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
      {user ? null : (
        <CardWithCallout
          button={
            <Button
              className="w-full md:w-auto"
              mode="tertiary"
              iconName="cardholder"
              text={MSG.connectWalletButton}
              onClick={connectWallet}
            />
          }
          iconName="plugs"
          subtitle={formatMessage(MSG.connectWalletTitle)}
          text={formatMessage(MSG.connectWalletSubtitle)}
        />
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
              mode="tertiary"
              text={MSG.joinColonyButton}
              onClick={validateAndRedirect}
            />
          ) : null
        }
        iconName="lock"
        title={colonyDisplayName}
        text={formatMessage(MSG.restrictedAccessMessage)}
      />
    </div>
  );
};

ColonyPreviewPage.displayName = displayName;

export default ColonyPreviewPage;
