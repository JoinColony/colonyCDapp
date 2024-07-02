import clsx from 'clsx';
import { createElement, type FC } from 'react';

import ExternalLink from '~shared/ExternalLink/index.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';

import { type TransactionLinkProps } from './types.ts';

const displayName = 'TransactionLink';

const TransactionLink: FC<TransactionLinkProps> = ({
  hash,
  children,
  className,
  ...rest
}) =>
  createElement(
    ExternalLink,
    {
      href: getBlockExplorerLink({
        linkType: 'tx',
        addressOrHash: hash,
      }),
      className: clsx(className, 'hover:text-gray-900'),
      ...rest,
    },
    children,
  );

TransactionLink.displayName = displayName;

export default TransactionLink;
