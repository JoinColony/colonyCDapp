import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';

import { useTablet } from '~hooks';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import ColonyLogo from '~icons/ColonyLogo.tsx';
import FeedbackButton from '~shared/FeedbackButton/index.ts';
import { usePageLayoutContext } from '~v5/frame/PageLayout/context/PageLayoutContext.ts';

import ColonySwitcher from '../ColonySwitcher/index.ts';

import {
  colonySidebarDesktopClass,
  colonySidebarTabletClass,
} from './colonySidebar.styles.ts';
import { colonySidebarAnimationVariants } from './consts.ts';
import ActionSection from './partials/ActionSection/ActionSection.tsx';
import NavigationSection from './partials/RouteSection/NavigationSection.tsx';

const displayName = 'v5.common.Navigation.ColonySidebar';

const ColonySidebarContent = () => {
  const isTablet = useTablet();

  return (
    <>
      <section className="flex flex-col gap-4">
        {!isTablet && <ColonySwitcher />}
        <ActionSection />
        <div className="mx-auto h-0.5 w-[184px] bg-gray-700" />
        <NavigationSection />
      </section>
      <section className="flex flex-col gap-2">
        <FeedbackButton onClick={() => true} />
        <div className="pb-2 pl-3">
          <ColonyLogo />
        </div>
      </section>
    </>
  );
};

const ColonySidebar = () => {
  const { showTabletSidebar, setShowTabletSidebar } = usePageLayoutContext();
  const isTablet = useTablet();

  useDisableBodyScroll(isTablet && showTabletSidebar);

  useEffect(() => {
    if (isTablet) {
      setShowTabletSidebar(false);
    }
  }, [isTablet, setShowTabletSidebar]);

  if (isTablet) {
    return (
      <AnimatePresence>
        {showTabletSidebar ? (
          <motion.section
            variants={colonySidebarAnimationVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ ease: 'easeInOut' }}
            className={colonySidebarTabletClass}
          >
            <ColonySidebarContent />
          </motion.section>
        ) : null}
      </AnimatePresence>
    );
  }

  return (
    <section className={colonySidebarDesktopClass}>
      <ColonySidebarContent />
    </section>
  );
};

ColonySidebar.displayName = displayName;

export default ColonySidebar;
