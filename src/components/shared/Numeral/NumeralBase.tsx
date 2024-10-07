import classNames from 'classnames';
import React, { type FC } from 'react';

import { getMainClasses } from '~utils/css/index.ts';

import { type NumeralProps } from './types.ts';

import styles from './Numeral.module.css';

type Props = Omit<NumeralProps, 'value'>;
export const NumeralBase: FC<Props> = ({
  children,
  className,
  prefix,
  suffix,
  appearance,
  ...rest
}) => {
  return (
    <span
      className={classNames(getMainClasses(appearance, styles), className)}
      {...rest}
    >
      {prefix}
      {children}
      {suffix}
    </span>
  );
};
