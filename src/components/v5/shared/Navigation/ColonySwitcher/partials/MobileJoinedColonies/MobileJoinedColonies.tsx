import { Plus } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react';

import { LEARN_MORE_PAYMENTS } from '~constants/externalUrls.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTablet } from '~hooks';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import LearnMore from '~shared/Extensions/LearnMore/LearnMore.tsx';
import Button from '~v5/shared/Button/index.ts';

import JoinedColoniesList from '../JoinedColoniesList.tsx';
import { ConnectWalletSection } from '../TitleSections/ConnectWalletSection.tsx';

import { motionVariants } from './consts.ts';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.MobileJoinedColonies';

const MobileJoinedColonies = () => {
  const isTablet = useTablet();

  const ref = useRef<HTMLDivElement>(null);

  const { wallet, connectWallet } = useAppContext();

  const { showTabletColonyPicker } = usePageLayoutContext();

  useDisableBodyScroll(isTablet && showTabletColonyPicker);

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
            'fixed left-0 z-userNavModal flex h-[calc(100vh-var(--header-nav-section-height)-var(--top-content-height))] w-full flex-col justify-between overflow-y-auto rounded-none bg-base-white px-[10px] py-6 no-scrollbar',
            'md:static md:h-full md:w-[216px] md:rounded-lg',
          )}
        >
          <div className="flex h-fit w-full flex-col gap-3">
            {wallet ? <JoinedColoniesList /> : <ConnectWalletSection />}
          </div>
          <section className="flex w-full flex-col gap-6 px-2">
            <div className="border-b border-gray-200" />
            {wallet ? (
              <Button
                mode="primarySolid"
                text={{ id: 'button.createNewColony' }}
                className="w-full border-gray-300"
                icon={Plus}
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
              message={{
                id: `${displayName}.helpText`,
                defaultMessage: 'Need help and guidance? <a>Visit our docs</a>',
              }}
              href={LEARN_MORE_PAYMENTS}
            />
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

MobileJoinedColonies.displayName = displayName;

export default MobileJoinedColonies;
