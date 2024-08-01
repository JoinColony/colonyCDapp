import {
  ArrowLineRight,
  ArrowsOutSimple,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import { type Variants, motion } from 'framer-motion';
import React, {
  useCallback,
  useState,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';

const displayName = 'v5.common.ActionSidebar.ActionSidebarLayout';

interface Props {
  badges?: ReactNode;
  shareButton?: ReactNode;
  userNavigation?: ReactNode;
}

const actionSidebarAnimation: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
  },
};

const ActionSidebarLayout: FC<PropsWithChildren<Props>> = ({
  badges,
  children,
  shareButton,
  userNavigation,
}) => {
  const {
    actionSidebarToggle: [
      ,
      { toggle: toggleActionSidebarOff, registerContainerRef, toggleOff },
    ],
    cancelModalToggle: [isCancelModalOpen, { toggleOff: toggleCancelModalOff }],
  } = useActionSidebarContext();

  const [isSidebarMaximized, setIsSidebarMaximized] = useState<boolean>(false);
  const toggleSidebarMaximized = useCallback(() => {
    setIsSidebarMaximized(!isSidebarMaximized);
  }, [isSidebarMaximized]);

  const isMobile = useMobile();

  return (
    <motion.div
      transition={{
        ease: 'easeInOut',
      }}
      variants={actionSidebarAnimation}
      exit="hidden"
      initial="hidden"
      animate="visible"
      className={clsx(
        `
          modal-blur
          fixed
          bottom-4
          right-0
          top-0
          isolate
          z-sidebar
          flex
          h-full
          w-full
          flex-col
          border
          border-r-0
          border-gray-200
          bg-base-white
          shadow-default
          transition-[max-width]
          md:bottom-0
          md:top-4
          md:h-[calc(100vh-2rem)]
          md:w-[calc(100vw-8.125rem)]
          md:rounded-l-lg
        `,
        {
          'md:max-w-full': isSidebarMaximized,
          'md:max-w-[43.375rem]': !isSidebarMaximized,
        },
      )}
      ref={registerContainerRef}
    >
      <div className="relative">
        <div className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
              onClick={toggleOff}
              aria-label={formatText({ id: 'ariaLabel.closeModal' })}
            >
              <X size={18} />
            </button>
            {!isMobile && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
                    onClick={toggleSidebarMaximized}
                    aria-label={formatText({ id: 'ariaLabel.fullWidth' })}
                  >
                    {isSidebarMaximized ? (
                      <ArrowLineRight size={18} />
                    ) : (
                      <ArrowsOutSimple size={18} />
                    )}
                  </button>
                  {shareButton}
                </div>
                {badges}
              </div>
            )}
            {isMobile && shareButton}
          </div>
          {userNavigation}
        </div>
      </div>
      {children}
      <Modal
        title={formatText({ id: 'actionSidebar.cancelModal.title' })}
        subTitle={formatText({
          id: 'actionSidebar.cancelModal.subtitle',
        })}
        isOpen={isCancelModalOpen}
        onClose={toggleCancelModalOff}
        onConfirm={() => {
          toggleCancelModalOff();
          toggleActionSidebarOff();
        }}
        icon={WarningCircle}
        buttonMode="primarySolid"
        confirmMessage={formatText({ id: 'button.cancelAction' })}
        closeMessage={formatText({
          id: 'button.continueAction',
        })}
      />
    </motion.div>
  );
};

ActionSidebarLayout.displayName = displayName;

export default ActionSidebarLayout;
