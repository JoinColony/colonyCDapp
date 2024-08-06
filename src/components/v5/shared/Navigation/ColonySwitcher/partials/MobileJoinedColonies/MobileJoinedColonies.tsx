import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react';

import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTablet } from '~hooks';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import Button from '~v5/shared/Button/index.ts';

import JoinedColoniesList from '../JoinedColoniesList.tsx';

import { motionVariants } from './consts.ts';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.MobileJoinedColonies';

const MobileJoinedColonies = () => {
  const isTablet = useTablet();

  const ref = useRef<HTMLDivElement>(null);

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
            'fixed left-0 z-userNavModal flex h-[calc(100vh-var(--header-nav-section-height)-var(--top-content-height))] w-full flex-col justify-between overflow-y-auto rounded-none bg-base-white p-[10px] no-scrollbar',
            'md:static md:h-full md:w-[216px] md:rounded-lg',
          )}
        >
          <div className="flex h-fit w-full flex-col gap-3">
            <JoinedColoniesList />
          </div>
          <section className="w-full px-2 pt-2">
            <Button
              mode="primaryOutlineFull"
              text={{ id: 'button.createNewColony' }}
              className="w-full border-gray-300"
            />
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

MobileJoinedColonies.displayName = displayName;

export default MobileJoinedColonies;
