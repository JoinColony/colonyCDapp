import React, { FC } from 'react';
import { useExtensionsData } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';

const displayName = 'frame.Extensions.pages.IncorporationPage';

const IncorporationPage: FC = () => {
  const { loading } = useExtensionsData();

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={{ id: 'extensionsPage.loading' }}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  return <p>Incorporation page</p>;
};

IncorporationPage.displayName = displayName;

export default IncorporationPage;
