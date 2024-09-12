import clsx from 'clsx';
import React from 'react';

import { capitalizeFirstLetter } from '~utils/strings.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';

import { ActiveColonyIndicator } from './partials/ActiveColonyIndicator.tsx';
import { type JoinedColonyItemProps } from './types.ts';

const displayName =
  'v5.shared.Navigation.ColonySwitcher.partials.JoinedColonyItem';

const JoinedColonyItem = ({
  onClick,
  metadata,
  name,
  colonyAddress,
  tokenSymbol,
  isActiveColony,
  enableMobileAndDesktopLayoutBreakpoints,
}: JoinedColonyItemProps) => {
  return (
    <button
      type="button"
      className={clsx(
        'group flex h-[50px] w-full flex-row items-center justify-start gap-2.5 rounded px-6 py-[2.625rem] md:px-2 md:py-0 md:hover:bg-gray-50',
        {
          'sm:px-2 sm:py-0': enableMobileAndDesktopLayoutBreakpoints,
        },
      )}
      onClick={() => !isActiveColony && onClick(name)}
    >
      <div className="w-8">
        <ColonyAvatar
          colonyAddress={colonyAddress}
          className="w-8 flex-shrink-0"
          size={32}
          colonyImageSrc={
            metadata?.avatar
              ? metadata?.thumbnail ?? metadata?.avatar
              : undefined
          }
        />
      </div>
      <div className="flex w-full flex-col overflow-hidden text-left">
        <p className="truncate text-md font-semibold text-gray-900">
          {capitalizeFirstLetter(name)}
        </p>
        <p className="truncate text-sm font-normal uppercase text-gray-600">
          {tokenSymbol}
        </p>
      </div>
      <div className="flex flex-1 flex-row items-center justify-end">
        <ActiveColonyIndicator isActive={isActiveColony} />
      </div>
    </button>
  );
};

JoinedColonyItem.displayName = displayName;

export default JoinedColonyItem;
