import React, { PropsWithChildren } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import Onboarding, { Flow } from '~common/Onboarding';
import { HeaderRow } from '~common/Onboarding/wizardSteps/shared';
import { MainLayout } from '~frame/Extensions/layouts';
import { useGetPrivateBetaCodeInviteValidityQuery } from '~gql';
import { useAppContext } from '~hooks';
import { LANDING_PAGE_ROUTE } from '~routes';
import { formatText } from '~utils/intl';
import CardConnectWallet from '~v5/shared/CardConnectWallet';
import NotificationBanner from '~v5/shared/NotificationBanner';
import Spinner from '~v5/shared/Spinner';

const displayName = 'frame.v5.OnboardingPage';

const MSG = defineMessages({
  privateBeta: {
    id: `${displayName}.privateBeta`,
    defaultMessage:
      "The Colony app is in private beta, allowing invited members and Colony's to test out the new features before launch.",
  },
  connectWalletTitle: {
    id: `${displayName}.connectWalletTitle`,
    defaultMessage: 'Connect wallet',
  },
  connectWalletText: {
    id: `${displayName}.connectWalletText`,
    defaultMessage: 'A connected wallet is required to interact with Colony.',
  },
  loadingMessage: {
    id: `${displayName}.loadingMessage`,
    defaultMessage: 'Checking your access...',
  },
  invite: {
    id: `${displayName}.invite`,
    defaultMessage:
      'You have been invited to create a Colony for the private beta',
  },
  invalidInvite: {
    id: `${displayName}.invalidInvite`,
    defaultMessage: 'Sorry, your invite code is not valid. Please check again',
  },
});

interface Props {
  flow: Flow;
}

const SplashLayout = ({ children }: PropsWithChildren) => (
  <MainLayout>
    <article className="mx-auto max-w-lg">
      <HeaderRow
        heading={{ id: 'colonyWelcome' }}
        description={MSG.privateBeta}
      />
      {children}
    </article>
  </MainLayout>
);

const OnboardingPage = ({ flow }: Props) => {
  const { connectWallet, user, userLoading, wallet, walletConnecting } =
    useAppContext();
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { data, loading } = useGetPrivateBetaCodeInviteValidityQuery({
    skip: !inviteCode || flow === Flow.User,
    variables: { id: inviteCode || '' },
  });
  const valid = (data?.getPrivateBetaInviteCode?.shareableInvites || 0) > 0;

  if (userLoading || walletConnecting || loading) {
    return (
      <SplashLayout>
        <Spinner loading loadingText={MSG.loadingMessage} />
      </SplashLayout>
    );
  }

  if (flow === Flow.User && user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  if (!wallet || (flow === Flow.Colony && !valid)) {
    return (
      <SplashLayout>
        {flow === Flow.Colony && !valid ? (
          <NotificationBanner
            icon={valid ? 'hands-clapping' : 'hand-waving'}
            status={valid ? 'success' : 'error'}
            className="my-8"
          >
            {valid ? formatText(MSG.invite) : formatText(MSG.invalidInvite)}
          </NotificationBanner>
        ) : null}
        {!wallet ? (
          <CardConnectWallet
            connectWallet={connectWallet}
            title={formatText(MSG.connectWalletTitle)}
            text={formatText(MSG.connectWalletText)}
          />
        ) : null}
      </SplashLayout>
    );
  }

  return <Onboarding flow={flow} inviteCode={inviteCode} />;
};

OnboardingPage.displayName = displayName;

export default OnboardingPage;
