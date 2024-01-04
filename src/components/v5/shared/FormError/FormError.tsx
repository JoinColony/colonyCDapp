import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import { FormErrorProps } from './types';

const displayName = 'Extensions.FormError';

const FormError: FC<PropsWithChildren<FormErrorProps>> = ({
  alignment = 'right',
  isFullSize,
  children,
  allowLayoutShift = true,
}) => (
  <div
    className={clsx(
      `flex w-[8.75rem]`,
      allowLayoutShift ? 'mt-1' : 'absolute',
      {
        'w-full': isFullSize,
        'text-right justify-end': alignment === 'right',
        'text-left justify-start': alignment === 'left',
        'text-center justify-center': alignment === 'center',
      },
    )}
  >
    <span className="font-normal text-sm text-negative-400">{children}</span>
  </div>
);

FormError.displayName = displayName;

export default FormError;
