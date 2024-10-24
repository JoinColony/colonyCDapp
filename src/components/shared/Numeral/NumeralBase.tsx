import React, { type FC } from 'react';

import { type NumeralProps } from './types.ts';

type Props = Omit<NumeralProps, 'value'>;
export const NumeralBase: FC<Props> = ({
  children,
  className,
  prefix,
  suffix,
  ...rest
}) => {
  return (
    <span className={className} {...rest}>
      {prefix}
      {children}
      {suffix}
    </span>
  );
};
