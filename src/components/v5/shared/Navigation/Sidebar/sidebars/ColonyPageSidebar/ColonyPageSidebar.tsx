import { Plus } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { LEARN_MORE_COLONY_HELP_GENERAL } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTablet } from '~hooks/index.ts';
import LearnMore from '~shared/Extensions/LearnMore/LearnMore.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import Sidebar from '~v5/shared/Navigation/Sidebar/index.ts';

import {
  colonyPageSidebarDesktopClass,
  colonyPageSidebarTabletClass,
} from './colonyPageSidebar.styles.ts';
import { motionVariants } from './consts.ts';
import { SidebarActionsSection } from './partials/SidebarActionsSection.tsx';
import { SidebarRoutesSection } from './partials/SidebarRoutesSection.tsx';

const displayName = 'v5.shared.Navigation.Sidebar.sidebars.ColonyPageSidebar';

const ColonyPageSidebarContent = () => (
  <section className="flex flex-col gap-3 overflow-y-auto md:gap-4">
    <SidebarActionsSection />
    <div className="mx-3 border-b border-gray-200 md:mx-2 md:border-gray-700" />
    <SidebarRoutesSection />
  </section>
);

const ColonyPageSidebar = () => {
  const { showTabletSidebar, setShowTabletSidebar } = usePageLayoutContext();

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const isTablet = useTablet();

  const handleCreateNewAction = () => {
    toggleActionSidebarOn();

    // It looks glitchy if this component slides out of view while
    // the Action Form slides into view
    setTimeout(() => setShowTabletSidebar(false), 500);
  };

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
            <section className="flex flex-col gap-6 px-3 pb-3">
              <div className="border-b border-gray-200" />
              <Button
                mode="primarySolid"
                text={{ id: 'button.createNewAction' }}
                className="w-full border-gray-300 font-semibold"
                onClick={handleCreateNewAction}
                icon={Plus}
              />
              <LearnMore
                message={{ id: 'learnMoreComponent.helpAndGuidance' }}
                href={LEARN_MORE_COLONY_HELP_GENERAL}
              />
            </section>
          </motion.section>
        ) : null}
      </AnimatePresence>
    );
  }

  return (
    <Sidebar
      className={colonyPageSidebarDesktopClass}
      showColonySwitcher={!isTablet}
      headerClassName="mb-[27px]"
      footerClassName="!items-start !gap-2"
      colonySwitcherProps={{ showColonySwitcherText: true }}
    >
      <ColonyPageSidebarContent />
    </Sidebar>
  );
};

ColonyPageSidebar.displayName = displayName;

export default ColonyPageSidebar;
