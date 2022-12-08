import React from 'react';

import Heading, { Heading3Props as Heading6Props } from '../Heading';

const displayName = 'Heading.H6';

const Heading6 = ({ appearance, ...props }: Heading6Props) => (
  <Heading
    appearance={{ size: 'tiny', weight: 'bold', ...appearance }}
    {...props}
  />
);

Heading6.displayName = displayName;
export default Heading6;
