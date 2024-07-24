import clsx from 'clsx';
import React from 'react';

import { type HocWithLoadingProps } from './types.ts';

const hocWithLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & HocWithLoadingProps> => {
  return ({
    isLoading,
    loaderClassName,
    ...wrappedComponentProps
  }: HocWithLoadingProps & P) => {
    return isLoading ? (
      <div className={clsx('overflow-hidden skeleton', loaderClassName)} />
    ) : (
      <WrappedComponent {...(wrappedComponentProps as P)} />
    );
  };
};

export default hocWithLoading;
