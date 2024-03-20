import clsx from 'clsx';
import React, { type FC } from 'react';

import { TextButton } from '~v5/shared/Button/index.ts';

import { type EmptyWidgetStateProps } from './types.ts';

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
      'flex flex-col items-center justify-center gap-1 text-sm text-gray-600',
    )}
  >
    {title}
    <TextButton
      className="text-sm font-normal text-gray-900 underline"
      onClick={onClick}
    >
      {actionTitle}
    </TextButton>
  </div>
);

EmptyWidgetState.displayName = displayName;

export default EmptyWidgetState;
