import React from 'react';

import Heading, { Heading3Props as Heading4Props } from '../Heading';

const displayName = 'Heading.Heading4';

const Heading4 = ({ appearance, ...props }: Heading4Props) => (
  <Heading appearance={{ size: 'normal', weight: 'thin', ...appearance }} {...props} />
);

Heading4.displayName = displayName;
export default Heading4;
