import React from 'react';

import { type ColonyContextValue } from '~context/ColonyContext/ColonyContext.ts';
import ColonySwitcherAvatar from '~v5/common/Navigation/ColonySwitcher/partials/ColonySwitcherAvatar/index.ts';
import MobileJoinedColonies from '~v5/common/Navigation/ColonySwitcher/partials/MobileJoinedColonies/index.ts';
import { usePageLayoutContext } from '~v5/frame/PageLayout/context/PageLayoutContext.ts';

const displayName =
  'v5.frame.PageLayout.partials.PageHeader.partials.MobileColonySwitcherToggle';

const MobileColonySwitcherToggle = ({
  colonyContext,
}: {
  colonyContext: ColonyContextValue | undefined;
}) => {
  const { toggleMobileColonyPicker, setShowMobileSidebar } =
    usePageLayoutContext();

  const onClick = () => {
    setShowMobileSidebar(false);
    toggleMobileColonyPicker();
  };

  return (
    <>
      <button onClick={onClick} type="button" className="flex-shrink-0">
        <ColonySwitcherAvatar colonyContext={colonyContext} />
      </button>
      <MobileJoinedColonies />
    </>
  );
};

MobileColonySwitcherToggle.displayName = displayName;

export default MobileColonySwitcherToggle;
