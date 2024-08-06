import clsx from 'clsx';
import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTablet } from '~hooks';
import ColonyIcon from '~icons/ColonyIcon.tsx';
import Avatar from '~v5/shared/Avatar/index.ts';

export const ColonySwitcherAvatar = () => {
  const colonyContext = useColonyContext({ nullableContext: true });

  const { showTabletColonyPicker } = usePageLayoutContext();

  const isTablet = useTablet();

  const colonyAvatarSrc = colonyContext?.colony?.metadata?.avatar
    ? colonyContext.colony.metadata?.thumbnail ??
      colonyContext.colony.metadata?.avatar
    : undefined;

  return (
    <div
      className={clsx('rounded-full border-2 border-base-white', {
        'border-blue-400': showTabletColonyPicker && isTablet,
        'border-gray-900': !colonyContext && !isTablet,
      })}
    >
      {colonyContext ? (
        <Avatar
          address={colonyContext.colony.colonyAddress}
          size={36}
          src={colonyAvatarSrc}
        />
      ) : (
        <ColonyIcon
          size={36}
          className={clsx({
            'text-base-white': colonyContext,
          })}
        />
      )}
    </div>
  );
};
