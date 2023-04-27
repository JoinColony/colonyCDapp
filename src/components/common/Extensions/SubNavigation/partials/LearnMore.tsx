import React, { PropsWithChildren, FC } from 'react';

import ExternalLink from '~shared/ExternalLink/ExternalLink';

import { LearnMoreProps } from './types';

const displayName = 'common.Extensions.SubNavigation.partials.LearnMore';

const LearnMore: FC<PropsWithChildren<LearnMoreProps>> = ({ chunks, href }) => {
  return (
    <ExternalLink href={href}>
      <div className="font-semibold ml-1 text-gray-900 underline underline-offset-2 hover:cursor-pointer">{chunks}</div>
    </ExternalLink>
  );
};

LearnMore.displayName = displayName;

export default LearnMore;
