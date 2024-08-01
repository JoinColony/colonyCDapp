import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react';

import { useTablet } from '~hooks';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import { usePageLayoutContext } from '~v5/frame/PageLayout/context/PageLayoutContext.ts';
import Button from '~v5/shared/Button/index.ts';

import JoinedColoniesList from '../JoinedColoniesList/JoinedColoniesList.tsx';

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
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={!isTablet ? undefined : { opacity: 0, x: -100 }}
          transition={{
            x: { type: 'spring', bounce: 0 },
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
