import React, { FC } from 'react';
import { useExtensionsData } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';

const displayName = 'frame.Extensions.pages.AdvancedPage';

const AdvancedPage: FC = () => {
  const { loading } = useExtensionsData();

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={{ id: 'extensionsPage.loading' }}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  return <p>Colony details page</p>;
};

AdvancedPage.displayName = displayName;

export default AdvancedPage;
