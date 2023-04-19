import React, { PropsWithChildren } from 'react';

import { LearnMoreProps } from './types';

const displayName = 'Extensions.SubNavigation.DropdownItems.LearnMore';

const LearnMore: React.FC<PropsWithChildren<LearnMoreProps>> = ({ chunks, href }) => {
  return (
    <a className="font-semibold ml-1 hover:cursor-pointer" href={href}>
      {chunks}
    </a>
  );
};

LearnMore.displayName = displayName;

export default LearnMore;
