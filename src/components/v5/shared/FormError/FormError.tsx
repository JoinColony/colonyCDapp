import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { type FormErrorProps } from './types.ts';

const displayName = 'Extensions.FormError';

const FormError: FC<PropsWithChildren<FormErrorProps>> = ({
  alignment = 'right',
  isFullSize,
  children,
  allowLayoutShift = true,
}) => (
  <div
    data-testid="form-error"
    className={clsx(
      `flex w-[8.75rem]`,
      allowLayoutShift ? 'pt-1' : 'absolute pt-1',
      {
        'w-full': isFullSize,
        'justify-end text-right': alignment === 'right',
        'justify-start text-left': alignment === 'left',
        'justify-center text-center': alignment === 'center',
      },
    )}
  >
    <span className="text-sm font-normal text-negative-400">{children}</span>
  </div>
);

FormError.displayName = displayName;

export default FormError;
