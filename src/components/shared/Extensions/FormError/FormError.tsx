import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';
import { FormErrorProps } from './types';

const displayName = 'Extensions.FormError';

const FormError: FC<PropsWithChildren<FormErrorProps>> = ({ aligment = 'right', children }) => (
  <div
    className={clsx(`flex mt-1 max-w-[8.75rem]`, {
      'justify-end': aligment === 'right',
      'justify-start': aligment === 'left',
      'justify-center': aligment === 'center',
    })}
  >
    <span className="font-normal text-sm text-negative-400">{children}</span>
  </div>
);

FormError.displayName = displayName;

export default FormError;
