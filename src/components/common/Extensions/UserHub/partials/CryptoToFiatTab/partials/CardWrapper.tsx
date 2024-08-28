import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

const displayName = 'common.Extensions.UserHub.partials.CardWrapper';

interface CardWrapperProps {
  isFormDisabled: boolean;
  hasError: boolean;
  isLoading: boolean;
}

const CardWrapper: FC<PropsWithChildren<CardWrapperProps>> = ({
  isFormDisabled,
  hasError,
  children,
  isLoading,
}) => {
  return (
    <div
      className={clsx('rounded-lg p-4', {
        'border border-gray-200 hover:border-blue-400': !isFormDisabled,
        'bg-gray-50': isFormDisabled,
        'border-negative-400': hasError,
        'bg-transparent': isLoading,
      })}
    >
      {children}
    </div>
  );
};

CardWrapper.displayName = displayName;

export default CardWrapper;
