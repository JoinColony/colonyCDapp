import {
  ArrowLineRight,
  ArrowsOutSimple,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, {
  useCallback,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks/index.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { actionSidebarAnimation } from './consts.ts';
import CreateAction from './partials/CreateAction/CreateAction.tsx';
import { type ActionSidebarProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren<ActionSidebarProps>> = ({
  children,
  initialValues,
  className,
}) => {
  const {
    actionSidebarToggle: [
      isActionSidebarOpen,
      { toggle: toggleActionSidebarOff, registerContainerRef, toggleOff },
    ],
    cancelModalToggle: [isCancelModalOpen, { toggleOff: toggleCancelModalOff }],
  } = useActionSidebarContext();

  const [isSidebarFullscreen, setIsSidebarFullscreen] =
    useState<boolean>(false);
  const toggleSidebarFullscreen = useCallback(() => {
    setIsSidebarFullscreen(!isSidebarFullscreen);
  }, [isSidebarFullscreen]);

  const isMobile = useMobile();

  useDisableBodyScroll(isActionSidebarOpen);

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
        className,
        `
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
          'md:max-w-full': isSidebarFullscreen,
          'md:max-w-[43.375rem]': !isSidebarFullscreen,
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
                    onClick={toggleSidebarFullscreen}
                    aria-label={formatText({ id: 'ariaLabel.fullWidth' })}
                  >
                    {isSidebarFullscreen ? (
                      <ArrowLineRight size={18} />
                    ) : (
                      <ArrowsOutSimple size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>{children}</div>
        </div>
      </div>
      <CreateAction defaultValues={initialValues} />
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

ActionSidebar.displayName = displayName;

export default ActionSidebar;
