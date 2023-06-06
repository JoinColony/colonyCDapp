import React, { FC, PropsWithChildren } from 'react';
import { useExtensionsData } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import { SpinnerProps } from './types';

const displayName = 'Extensions.Spinner';

const Spinner: FC<PropsWithChildren<SpinnerProps>> = ({ loadingText, children }) => {
  const { loading } = useExtensionsData();

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={loadingText && { id: `${loadingText}.loading` }}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  return <div className="bg-base-white h-full">{children}</div>;
};

Spinner.displayName = displayName;

export default Spinner;
