import React from 'react';

import Heading, { HeadingAppearance, HeadingProps } from './Heading';

const displayName = 'Heading.Heading5';

export interface Heading5Props extends Omit<HeadingProps, 'appearance'> {
  appearance?: Partial<HeadingAppearance>;
}

const Heading5 = ({ appearance, ...props }: Heading5Props) => (
  <Heading
    appearance={{ size: 'small', weight: 'bold', ...appearance }}
    {...props}
  />
);

Heading5.displayName = displayName;

export default Heading5;
