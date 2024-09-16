import clsx from 'clsx';
import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import ColonyIcon from '~icons/ColonyIcon.tsx';
import Avatar from '~v5/shared/Avatar/index.ts';

export const ColonySwitcherAvatar = ({
  enableMobileAndDesktopLayoutBreakpoints,
}: {
  enableMobileAndDesktopLayoutBreakpoints?: boolean;
}) => {
  const colonyContext = useColonyContext({ nullableContext: true });

  const { showTabletColonyPicker } = usePageLayoutContext();

  const colonyAvatarSrc = colonyContext?.colony?.metadata?.avatar
    ? colonyContext.colony.metadata?.thumbnail ??
      colonyContext.colony.metadata?.avatar
    : undefined;

  return (
    <div
      className={clsx(
        'flex-shrink-0 rounded-full shadow-[0_0_0_4px] shadow-transparent transition-shadow duration-[250] md:shadow-none',
        {
          '!shadow-blue-400': showTabletColonyPicker,
          'sm:!shadow-none': enableMobileAndDesktopLayoutBreakpoints,
        },
      )}
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
          className={clsx('text-gray-900 md:text-base-white', {
            '!text-base-white': enableMobileAndDesktopLayoutBreakpoints,
          })}
        />
      )}
    </div>
  );
};
