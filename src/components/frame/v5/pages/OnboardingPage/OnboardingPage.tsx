import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useAppContext } from '~hooks';
import { LANDING_PAGE_ROUTE } from '~routes';
import Onboarding from '~common/Onboarding';
import { Flow } from '~common/Onboarding/types';
import { useGetPrivateBetaCodeInviteValidityQuery } from '~gql';
import Spinner from '~v5/shared/Spinner';

import ConnectWalletSplash from './ConnectWalletSplash';

const displayName = 'frame.v5.OnboardingPage';

interface Props {
  flow: Flow;
}

const OnboardingPage = ({ flow }: Props) => {
  const { userLoading, wallet, walletConnecting } = useAppContext();

  const { inviteCode } = useParams<{ inviteCode: string }>();
  // @TODO: handle errors, fix the stupid hook problem
  const { data, loading } = useGetPrivateBetaCodeInviteValidityQuery({
    skip: !inviteCode || flow === 'user',
    variables: { id: inviteCode || '' },
  });
  const valid = (data?.getPrivateBetaInviteCode?.shareableInvites || 0) > 0;

  if (walletConnecting || userLoading || loading) {
    // FIX: add loading spinner
    return null;
  }

  if (flow === 'colony' && !valid) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  return (
    <Spinner
      loading={
        walletConnecting || userLoading
        /* || loading */
      }
    >
      <>
        {!wallet ? (
          <ConnectWalletSplash validInvite={valid} />
        ) : (
          <Onboarding flow={flow} inviteCode={inviteCode} />
        )}
      </>
    </Spinner>
  );
};

OnboardingPage.displayName = displayName;

export default OnboardingPage;
