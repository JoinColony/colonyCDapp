import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { SpinnerLoader } from '~shared/Preloaders';
import { SpinnerProps } from './types';

const displayName = 'v5.Spinner';

const Spinner: FC<PropsWithChildren<SpinnerProps>> = ({
  loading,
  loadingText,
  children,
}) => {
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

  return <>{children}</>;
};

Spinner.displayName = displayName;

export default Spinner;
