import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import CardWithCallout from '~v5/shared/CardWithCallout/CardWithCallout';
// import Spinner from '~v5/shared/Spinner';
import Button from '~v5/shared/Button';
import { useAppContext } from '~hooks';
import Card from '~v5/shared/Card';
import Icon from '~shared/Icon';

const MSG = defineMessages({
  loadingMessage: {
    id: 'ColonyInvitePage.loadingMessage',
    defaultMessage: 'Checking your invite...',
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
  restrictedAccessMessage: {
    id: 'ColonyInvitePage.restrictedAccessMessage',
    defaultMessage:
      'This Colony has restricted access during the private beta test. Only members who have been invited can access the Colony during this time. To request access to this Colony, you can contact them via their social accounts above.',
  },
});

const UserInvitePage = () => {
  const { /* inviteCode, */ colonyName } = useParams<{
    inviteCode: string;
    colonyName: string;
  }>();
  const { formatMessage } = useIntl();
  const { connectWallet } = useAppContext();
  // @TODO: check invite code here

  // return <Spinner loading loadingText={MSG.loadingMessage} />;
  return (
    <div className="max-w-[34rem] mx-auto">
      <h1 className="text-2xl mb-2 font-semibold">
        <FormattedMessage {...MSG.heading} />
      </h1>
      <p className="text-sm mb-5">
        <FormattedMessage {...MSG.description} />
      </p>
      <hr />
      <NotificationBanner
        iconName="hands-clapping"
        status="success"
        className="my-8"
        title={formatMessage(MSG.notificationBannerTitle)}
      />
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
        title={MSG.connectWalletTitle}
        subtitle={MSG.connectWalletSubtitle}
      />
      <h2 className="text-md font-semibold mt-8 mb-3">
        <FormattedMessage {...MSG.requestAccessHeading} />
      </h2>
      <Card>
        <header className="flex gap-3 mb-2">
          <Icon name="lock" />
          <h1 className="text-md font-medium">{colonyName}</h1>
          <span className="flex items-center ml-auto">
            <Icon
              appearance={{ size: 'extraSmall', theme: 'primary' }}
              name="github-logo"
            />
          </span>
        </header>
        <p className="text-sm text-gray-600">
          <FormattedMessage {...MSG.restrictedAccessMessage} />
        </p>
      </Card>
    </div>
  );
};

export default UserInvitePage;
