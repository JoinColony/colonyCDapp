import React, { type FC } from 'react';

import ExternalLink from '~shared/ExternalLink/index.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';

import { type TransactionLinkProps } from './types.ts';

const displayName = 'TransactionLink';

const TransactionLink: FC<TransactionLinkProps> = ({ hash, children }) => (
  <ExternalLink
    href={getBlockExplorerLink({
      linkType: 'tx',
      addressOrHash: hash,
    })}
    className="hover:text-gray-900"
  >
    {children}
  </ExternalLink>
);

TransactionLink.displayName = displayName;

export default TransactionLink;
