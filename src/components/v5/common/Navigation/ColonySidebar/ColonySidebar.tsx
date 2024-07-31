import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useTablet } from '~hooks';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import ColonyLogo from '~icons/ColonyLogo.tsx';
import FeedbackButton from '~shared/FeedbackButton/index.ts';
import { usePageLayoutContext } from '~v5/frame/PageLayout/context/PageLayoutContext.ts';

import ColonySwitcher from '../ColonySwitcher/index.ts';

import ActionSection from './partials/ActionSection/ActionSection.tsx';
import NavigationSection from './partials/RouteSection/NavigationSection.tsx';

const displayName = 'v5.common.Navigation.ColonySidebar';

const ColonySidebar = () => {
  const colonyContext = useColonyContext();
  const { showMobileSidebar } = usePageLayoutContext();
  const isTablet = useTablet();

  const ref = useRef<HTMLDivElement>(null);

  useDisableBodyScroll(isTablet && showMobileSidebar);

  return (
    <AnimatePresence>
      {(!isTablet || showMobileSidebar) && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={!isTablet ? undefined : { opacity: 0, x: -100 }}
          transition={{
            x: { type: 'spring', bounce: 0 },
          }}
          className={clsx(
            /** Unfortunately, it's a bit tricky to string interpolate tailwind classes */
            'top-[calc(var(--header-nav-section-height)+var(--top-content-height))]',
            'fixed left-0 z-sidebar flex h-[calc(100vh-var(--header-nav-section-height)-var(--top-content-height))] w-full flex-col justify-between overflow-y-auto rounded-none bg-gray-900 p-[10px] no-scrollbar',
            'md:static md:h-full md:w-[216px] md:rounded-lg',
          )}
        >
          <section className="flex flex-col gap-4">
            {!isTablet && <ColonySwitcher colonyContext={colonyContext} />}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ColonySidebar.displayName = displayName;

export default ColonySidebar;
