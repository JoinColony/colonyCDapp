import React from 'react';

import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';

import { ColonySwitcherAvatar } from './ColonySwitcherAvatar.tsx';
import MobileJoinedColonies from './MobileJoinedColonies/index.ts';

const displayName =
  'v5.frame.PageLayout.partials.PageHeader.partials.MobileColonySwitcherToggle';

const MobileColonySwitcherToggle = () => {
  const { toggleTabletColonyPicker, setShowTabletSidebar } =
    usePageLayoutContext();

  const handleClick = () => {
    setShowTabletSidebar(false);
    toggleTabletColonyPicker();
  };

  return (
    <>
      <button onClick={handleClick} type="button" className="flex-shrink-0">
        <ColonySwitcherAvatar />
      </button>
      <MobileJoinedColonies />
    </>
  );
};

MobileColonySwitcherToggle.displayName = displayName;

export default MobileColonySwitcherToggle;
