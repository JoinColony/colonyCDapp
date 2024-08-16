import clsx from 'clsx';
import React from 'react';

import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';

import { ColonySwitcherAvatar } from './ColonySwitcherAvatar.tsx';
import MobileJoinedColonies from './MobileJoinedColonies/index.ts';

const displayName =
  'v5.frame.PageLayout.partials.PageHeader.partials.MobileColonySwitcherToggle';

const MobileColonySwitcherToggle = () => {
  const {
    toggleTabletColonyPicker,
    setShowTabletSidebar,
    showTabletColonyPicker,
  } = usePageLayoutContext();

  const onClick = () => {
    setShowTabletSidebar(false);
    toggleTabletColonyPicker();
  };

  return (
    <>
      <button onClick={onClick} type="button" className="flex-shrink-0">
        <ColonySwitcherAvatar
          className={clsx(
            'shadow-[0_0_0_4px] shadow-transparent transition-shadow duration-[250] md:shadow-none',
            {
              '!shadow-blue-400': showTabletColonyPicker,
            },
          )}
        />
      </button>
      <MobileJoinedColonies />
    </>
  );
};

MobileColonySwitcherToggle.displayName = displayName;

export default MobileColonySwitcherToggle;
