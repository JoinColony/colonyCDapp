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
    className={clsx(
      `flex w-[8.75rem]`,
      allowLayoutShift ? 'pt-1' : 'absolute pt-1',
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
