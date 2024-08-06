import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTablet } from '~hooks/index.ts';

import Sidebar from '../../index.ts';

import {
  colonyPageSidebarDesktopClass,
  colonyPageSidebarTabletClass,
} from './colonyPageSidebar.styles.ts';
import { motionVariants } from './consts.ts';
import { SidebarActionsSection } from './partials/SidebarActionsSection.tsx';
import { SidebarRoutesSection } from './partials/SidebarRoutesSection.tsx';

const displayName = 'v5.shared.Navigation.Sidebar.sidebars.ColonyPageSidebar';

const ColonyPageSidebarContent = () => (
  <section className="flex flex-col gap-4">
    <SidebarActionsSection />
    <div className="mx-auto h-0.5 w-[184px] bg-gray-700" />
    <SidebarRoutesSection />
  </section>
);

const ColonyPageSidebar = () => {
  const { showTabletSidebar } = usePageLayoutContext();

  const isTablet = useTablet();

  if (isTablet) {
    return (
      <AnimatePresence>
        {showTabletSidebar ? (
          <motion.section
            variants={motionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ ease: 'easeInOut' }}
            className={colonyPageSidebarTabletClass}
          >
            <ColonyPageSidebarContent />
          </motion.section>
        ) : null}
      </AnimatePresence>
    );
  }

  return (
    <Sidebar
      className={colonyPageSidebarDesktopClass}
      showColonySwitcher={!isTablet}
      headerClassName="mb-6"
      footerClassName="!items-start !gap-2"
    >
      <ColonyPageSidebarContent />
    </Sidebar>
  );
};

ColonyPageSidebar.displayName = displayName;

export default ColonyPageSidebar;
