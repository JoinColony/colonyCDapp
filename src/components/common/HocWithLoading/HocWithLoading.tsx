import React from 'react';

import { type HocWithLoadingProps } from './types.ts';

const hocWithLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & HocWithLoadingProps> => {
  return ({
    isLoading,
    containerClassName,
    skeletonFrame: { height, width, borderRadius = 8 },
    ...wrappedComponentProps
  }: HocWithLoadingProps & P) => {
    return isLoading ? (
      <div className={containerClassName}>
        <div
          className="overflow-hidden skeleton"
          style={{
            height: `${height}px`,
            width: `${width}px`,
            borderRadius: `${borderRadius}px`,
          }}
        />
      </div>
    ) : (
      <WrappedComponent {...(wrappedComponentProps as P)} />
    );
  };
};

export default hocWithLoading;
