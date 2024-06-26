import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

const displayName = 'common.Extensions.UserHub.partials.CardWrapper';

interface CardWrapperProps {
  isFormDisabled: boolean;
  hasError: boolean;
}

const CardWrapper: FC<PropsWithChildren<CardWrapperProps>> = ({
  isFormDisabled,
  hasError,
  children,
}) => {
  return (
    <div
      className={clsx('rounded-lg border border-gray-200 p-4', {
        'bg-gray-50': isFormDisabled,
        'border-negative-400': hasError,
      })}
    >
      {children}
    </div>
  );
};

CardWrapper.displayName = displayName;

export default CardWrapper;
