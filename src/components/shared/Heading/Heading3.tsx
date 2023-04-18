import React from 'react';

import Heading, { HeadingAppearance, HeadingProps } from './Heading';

const displayName = 'Heading.Heading3';

export interface Heading3Props extends Omit<HeadingProps, 'appearance'> {
  appearance?: Partial<HeadingAppearance>;
}

const Heading3 = ({ appearance, ...props }: Heading3Props) => (
  <Heading appearance={{ size: 'medium', weight: 'bold', ...appearance }} {...props} />
);

Heading3.displayName = displayName;
export default Heading3;
