import React, { type FC } from 'react';

import { type NumeralProps } from './types.ts';

type Props = Omit<NumeralProps, 'value'>;
export const NumeralComponent: FC<Props> = ({
  children,
  className,
  prefix,
  suffix,
  ...rest
}) => {
  return (
    <span className={className} {...rest}>
      {prefix && `${prefix} `}
      {children}
      {suffix}
    </span>
  );
};
