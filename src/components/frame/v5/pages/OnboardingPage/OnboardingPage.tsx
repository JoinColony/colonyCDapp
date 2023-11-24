import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useAppContext } from '~hooks';
import { LANDING_PAGE_ROUTE } from '~routes';
import Onboarding from '~common/Onboarding';
import { Flow } from '~common/Onboarding/types';
import { useGetPrivateBetaCodeInviteValidityQuery } from '~gql';

const displayName = 'frame.v5.OnboardingPage';

interface Props {
  flow: Flow;
}

const OnboardingPage = ({ flow }: Props) => {
  const { userLoading, wallet, walletConnecting } = useAppContext();

  const { inviteCode } = useParams<{ inviteCode: string }>();
  // @TODO: handle errors, fix the stupid hook problem
  const { data, loading } = useGetPrivateBetaCodeInviteValidityQuery({
    skip: !inviteCode,
    variables: { id: inviteCode || '' },
  });
  const valid = (data?.getPrivateBetaInviteCode?.shareableInvites || 0) > 0;

  if (flow === 'colony' && (!inviteCode || !valid)) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  if (walletConnecting || userLoading || loading) {
    // FIX: add loading spinner
    return null;
  }

  if (!wallet) {
    // FIX: navigate to splash
    return <p>Connect to me</p>;
  }

  return <Onboarding flow={flow} inviteCode={inviteCode} />;
};

OnboardingPage.displayName = displayName;

export default OnboardingPage;
