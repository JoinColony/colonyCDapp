import React, { type PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import Onboarding, { Flow } from '~common/Onboarding/index.ts';
import HeaderRow from '~common/Onboarding/wizardSteps/HeaderRow.tsx';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { MainLayout } from '~frame/Extensions/layouts/index.ts';
import CreateColonyPage from '~frame/v5/pages/CreateColonyPage/CreateColonyPage.tsx';
import { useGetPrivateBetaCodeInviteValidityQuery } from '~gql';
import { formatText } from '~utils/intl.ts';
import PageLoader from '~v5/common/PageLoader/index.ts';

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
  const { userLoading, wallet, walletConnecting } = useAppContext();
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { data, loading } = useGetPrivateBetaCodeInviteValidityQuery({
    skip: !inviteCode || flow === Flow.User,
    variables: { id: inviteCode || '' },
  });
  const valid = (data?.getPrivateBetaInviteCode?.shareableInvites || 0) > 0;

  if (userLoading || walletConnecting || loading) {
    return (
      <SplashLayout>
        <PageLoader loadingText={formatText(MSG.loadingMessage)} />
      </SplashLayout>
    );
  }

  if (!wallet || (flow === Flow.Colony && !valid)) {
    return <CreateColonyPage />;
  }

  return <Onboarding flow={flow} inviteCode={inviteCode} />;
};

OnboardingPage.displayName = displayName;

export default OnboardingPage;
