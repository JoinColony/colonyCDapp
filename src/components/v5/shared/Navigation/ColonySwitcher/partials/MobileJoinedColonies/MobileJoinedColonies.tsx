import { Plus } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react';

import { LEARN_MORE_COLONY_HELP_GENERAL } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTablet } from '~hooks';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import LearnMore from '~shared/Extensions/LearnMore/LearnMore.tsx';
import Button from '~v5/shared/Button/index.ts';
import { useCreateColonyRedirect } from '~v5/shared/Navigation/hooks/useCreateNewColony/index.ts';

import JoinedColoniesList from '../JoinedColoniesList.tsx';
import { ConnectWalletSection } from '../TitleSections/ConnectWalletSection.tsx';

import { motionVariants } from './consts.ts';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.MobileJoinedColonies';

const MobileJoinedColonies = () => {
  const isTablet = useTablet();

  const ref = useRef<HTMLDivElement>(null);

  const { wallet, connectWallet } = useAppContext();

  const { showTabletColonyPicker, toggleTabletColonyPicker } =
    usePageLayoutContext();

  useDisableBodyScroll(isTablet && showTabletColonyPicker);

  const handleCreateColonyRedirect = useCreateColonyRedirect();

  const handleCreateColonyClick = () => {
    toggleTabletColonyPicker();
    handleCreateColonyRedirect();
  };

  return (
    <AnimatePresence>
      {showTabletColonyPicker && (
        <motion.div
          ref={ref}
          variants={motionVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{
            ease: 'easeInOut',
          }}
          /** Unfortunately, it's a bit tricky to string interpolate tailwind classes */
          className={clsx(
            'top-[calc(var(--header-nav-section-height)+var(--top-content-height))]',
            'fixed left-0 z-userNavModal flex h-dynamic-screen w-full flex-col justify-between rounded-none bg-base-white',
          )}
        >
          <div className="flex h-fit w-full flex-col overflow-y-auto">
            {wallet ? (
              <JoinedColoniesList />
            ) : (
              <div className="p-6">
                <ConnectWalletSection />
              </div>
            )}
          </div>
          <section className="flex w-full flex-col gap-6 px-6 pb-6">
            <div className="border-b border-gray-200" />
            {wallet ? (
              <Button
                mode="primarySolid"
                text={{ id: 'button.createNewColony' }}
                className="w-full border-gray-300"
                icon={Plus}
                onClick={handleCreateColonyClick}
              />
            ) : (
              <Button
                mode="primarySolid"
                text={{ id: 'button.connectWallet' }}
                className="w-full border-gray-300"
                onClick={connectWallet}
              />
            )}
            <LearnMore
              message={{ id: 'learnMoreComponent.helpAndGuidance' }}
              href={LEARN_MORE_COLONY_HELP_GENERAL}
            />
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

MobileJoinedColonies.displayName = displayName;

export default MobileJoinedColonies;
