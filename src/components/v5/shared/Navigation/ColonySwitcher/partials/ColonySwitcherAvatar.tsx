import clsx from 'clsx';
import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import ColonyIcon from '~icons/ColonyIcon.tsx';
import Avatar from '~v5/shared/Avatar/index.ts';

export const ColonySwitcherAvatar = () => {
  const colonyContext = useColonyContext({ nullableContext: true });

  const colonyAvatarSrc = colonyContext?.colony?.metadata?.avatar
    ? colonyContext.colony.metadata?.thumbnail ??
      colonyContext.colony.metadata?.avatar
    : undefined;

  return (
    <div className={clsx('rounded-full')}>
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
