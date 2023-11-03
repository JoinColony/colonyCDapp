import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import CreateColonyWizard from '~v5/common/CreateColonyWizard';
import { useGetPrivateBetaCodeInviteValidityQuery } from '~gql';
import { LANDING_PAGE_ROUTE } from '~routes';

const CreateColonyPage = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  // @TODO: handle errors, fix the stupid hook problem
  const { data, loading } = useGetPrivateBetaCodeInviteValidityQuery({
    skip: !inviteCode,
    variables: { id: inviteCode || '' },
  });
  const valid = (data?.getPrivateBetaInviteCode?.shareableInvites || 0) > 0;

  if (loading) {
    // @TODO: add a loading spinner
    return <div>Loading...</div>;
  }

  if (!inviteCode || !valid) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

  return <CreateColonyWizard inviteCode={inviteCode} />;
};

export default CreateColonyPage;
