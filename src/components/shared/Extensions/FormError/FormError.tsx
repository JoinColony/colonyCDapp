import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';
import { FormErrorProps } from './types';

const displayName = 'Extensions.FormError';

const FormError: FC<PropsWithChildren<FormErrorProps>> = ({ alignment = 'right', isFullSize, children }) => (
  <div
    className={clsx(`flex mt-1 w-[8.75rem]`, {
      'w-full': isFullSize,
      'text-right justify-end': alignment === 'right',
      'text-left justify-start': alignment === 'left',
      'text-center justify-center': alignment === 'center',
    })}
  >
    <span className="font-normal text-sm text-negative-400">{children}</span>
  </div>
);

FormError.displayName = displayName;

export default FormError;
