import React, { FC } from 'react';
import clsx from 'clsx';
import { EmptyWidgetStateProps } from './types';
import { TextButton } from '~v5/shared/Button';

const displayName = 'common.WidgetBox.partials.EmptyState';

const EmptyWidgetState: FC<EmptyWidgetStateProps> = ({
  title,
  actionTitle,
  className,
  onClick,
}) => (
  <div
    className={clsx(
      className,
      'flex flex-col gap-1 items-center justify-center text-gray-600 text-sm',
    )}
  >
    {title}
    <TextButton
      className="text-gray-900 text-sm underline font-normal"
      onClick={onClick}
    >
      {actionTitle}
    </TextButton>
  </div>
);

EmptyWidgetState.displayName = displayName;

export default EmptyWidgetState;
