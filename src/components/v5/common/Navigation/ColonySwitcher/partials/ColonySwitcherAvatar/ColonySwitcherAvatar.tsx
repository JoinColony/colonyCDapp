import clsx from 'clsx';
import React from 'react';

import { useTablet } from '~hooks';
import ColonyIcon from '~icons/ColonyIcon.tsx';
import { usePageLayoutContext } from '~v5/frame/PageLayout/context/PageLayoutContext.ts';
import Avatar from '~v5/shared/Avatar/index.ts';

import { type ColonySwitcherProps } from '../../types.ts';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.ColonyPickerAvatar';

const ColonySwitcherAvatar = ({
  colonyContext,
}: Pick<ColonySwitcherProps, 'colonyContext'>) => {
  const { showMobileColonyPicker } = usePageLayoutContext();

  const isTablet = useTablet();

  const colonyAvatarSrc = colonyContext?.colony?.metadata?.avatar
    ? colonyContext.colony.metadata?.thumbnail ??
      colonyContext.colony.metadata?.avatar
    : undefined;

  return (
    <div
      className={clsx('rounded-full border-2 border-base-white', {
        'border-blue-400': showMobileColonyPicker && isTablet,
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

ColonySwitcherAvatar.displayName = displayName;

export default ColonySwitcherAvatar;
