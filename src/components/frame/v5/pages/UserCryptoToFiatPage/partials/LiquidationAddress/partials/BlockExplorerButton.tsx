import { ArrowSquareOut } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import ExternalLink from '~shared/ExternalLink/index.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import { formatText } from '~utils/intl.ts';
import buttonClasses from '~v5/shared/Button/Button.styles';

export const BlockExplorerButton = ({ address }: { address: string }) => (
  <ExternalLink
    href={getBlockExplorerLink({
      addressOrHash: address,
    })}
    className={clsx(
      buttonClasses.primaryOutlineFull,
      'flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border-gray-300 px-4 text-md',
      'font-medium text-gray-700 sm:hover:text-base-white',
      'transition-colors duration-normal',
    )}
  >
    <ArrowSquareOut className="aspect-square h-4 w-4" />
    {formatText(
      { id: 'completedAction.view' },
      {
        blockExplorerName: DEFAULT_NETWORK_INFO.blockExplorerName,
      },
    )}
  </ExternalLink>
);
