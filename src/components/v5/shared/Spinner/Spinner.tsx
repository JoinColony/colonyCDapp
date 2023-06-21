import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { useExtensionsData } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import { SpinnerProps } from './types';

const displayName = 'v5.Spinner';

const Spinner: FC<PropsWithChildren<SpinnerProps>> = ({
  loadingText,
  children,
}) => {
  const { loading } = useExtensionsData();
  const { formatMessage } = useIntl();

  const formattedLoadingText =
    typeof loadingText === 'string'
      ? loadingText
      : loadingText && formatMessage(loadingText);

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={
          formattedLoadingText || formatMessage({ id: 'label.loading' })
        }
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  return (
    <div className="bg-base-white overflow-x-hidden sm:overflow-visible">
      {children}
    </div>
  );
};

Spinner.displayName = displayName;

export default Spinner;
