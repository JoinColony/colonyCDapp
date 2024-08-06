import React from 'react';

import { capitalizeFirstLetter } from '~utils/strings.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';

import { type JoinedColonyItemProps } from './types.ts';

const displayName =
  'v5.shared.Navigation.ColonySwitcher.partials.JoinedColonyItem';

const JoinedColonyItem = ({
  onClick,
  metadata,
  name,
  colonyAddress,
  tokenSymbol,
}: JoinedColonyItemProps) => {
  return (
    <button
      type="button"
      className="group flex h-[37px] flex-row items-center justify-start gap-3 rounded-lg p-2 hover:bg-gray-50"
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
    </button>
  );
};

JoinedColonyItem.displayName = displayName;

export default JoinedColonyItem;
