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
}: JoinedColonyItemProps) => {
  return (
    <button
      type="button"
      className="group flex h-[50px] w-full flex-row items-center justify-start gap-3 rounded-lg px-4 py-8 hover:bg-gray-50 md:px-2 md:py-0"
      onClick={() => onClick(name)}
    >
      <section className="w-8">
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
      </section>
      <section className="flex w-full flex-col overflow-hidden text-left">
        <p className="truncate text-md font-semibold text-gray-900">
          {capitalizeFirstLetter(name)}
        </p>
        <p className="truncate text-sm font-normal uppercase text-gray-700">
          {tokenSymbol}
        </p>
      </section>
      <section className="flex flex-1 flex-row items-center justify-end">
        <ActiveColonyIndicator isActive={isActiveColony} />
      </section>
    </button>
  );
};

JoinedColonyItem.displayName = displayName;

export default JoinedColonyItem;
