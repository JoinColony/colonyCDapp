import React from 'react';

import ColonyLogo from '~icons/ColonyLogo.tsx';
import FeedbackButton from '~shared/FeedbackButton/index.ts';
import ColonySwitcher from '~v5/common/Navigation/ColonySwitcher/index.ts';

const displayName = 'v5.common.Navigation.LandingPageSidebar';

const LandingPageSidebar = () => {
  return (
    <div className="hidden h-full w-[82.22px] flex-col items-center justify-between rounded-lg bg-gray-900 px-[18px] pb-4 pt-3 md:flex">
      <ColonySwitcher isLogoButton />
      <section className="flex w-full flex-col items-center gap-3">
        <FeedbackButton onClick={() => true} isPopoverMode />
        <ColonyLogo />
      </section>
    </div>
  );
};

LandingPageSidebar.displayName = displayName;

export default LandingPageSidebar;
