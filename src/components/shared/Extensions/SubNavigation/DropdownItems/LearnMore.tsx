import React, { PropsWithChildren } from 'react';

import ExternalLink from '~shared/ExternalLink/ExternalLink';

import { LearnMoreProps } from './types';

const displayName = 'Extensions.SubNavigation.DropdownItems.LearnMore';

const LearnMore: React.FC<PropsWithChildren<LearnMoreProps>> = ({ chunks, href }) => {
  return (
    <ExternalLink className="font-semibold ml-1 hover:cursor-pointer" href={href}>
      {chunks}
    </ExternalLink>
  );
};

LearnMore.displayName = displayName;

export default LearnMore;
