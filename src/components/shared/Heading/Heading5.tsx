import React from 'react';

import Heading, {
  type HeadingAppearance,
  type HeadingProps,
} from './Heading.tsx';

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
