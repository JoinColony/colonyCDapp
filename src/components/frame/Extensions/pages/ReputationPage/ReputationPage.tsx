import React, { FC } from 'react';
import { useExtensionsData } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';

const displayName = 'frame.Extensions.pages.ReputationPage';

const ReputationPage: FC = () => {
  const { loading } = useExtensionsData();

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={{ id: 'reputationPage.loading' }}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  return <p>Reputation page</p>;
};

ReputationPage.displayName = displayName;

export default ReputationPage;
