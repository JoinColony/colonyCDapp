import {
  ArrowLineRight,
  ArrowsOutSimple,
  ShareNetwork,
  X,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, {
  type PropsWithChildren,
  useLayoutEffect,
  forwardRef,
} from 'react';

import { isFullScreen } from '~constants/index.ts';
import { useMobile } from '~hooks/index.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';

import ActionSidebarLoadingSkeleton from '../ActionSidebarLoadingSkeleton/ActionSidebarLoadingSkeleton.tsx';

import { actionSidebarAnimation } from './consts.ts';
import { type ActionSidebarLayoutProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.ActionSidebarLayout';

const ActionSidebarLayout = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ActionSidebarLayoutProps>
>(
  (
    {
      onCloseClick,
      children,
      additionalTopContent,
      statusPill,
      isLoading,
      className,
      isMotion,
      transactionId,
      actionNotFound,
      goBackButton,
      transactionHash,
    },
    ref,
  ) => {
    const isMobile = useMobile();
    const { isCopied, handleClipboardCopy } = useCopyToClipboard();
    const noActionFound = !!(actionNotFound && !isLoading);

    const [
      isSidebarFullscreen,
      { toggle: toggleIsSidebarFullscreen, toggleOn },
    ] = useToggle();

    useLayoutEffect(() => {
      if (localStorage.getItem(isFullScreen) === 'true') {
        toggleOn();
      }
    }, [toggleOn]);

    const getShareButton = () =>
      !!transactionHash && (
        <Tooltip
          tooltipContent={formatText({ id: 'copy.urlCopied' })}
          isOpen={isCopied}
          isSuccess={isCopied}
          placement="bottom"
        >
          <button
            type="button"
            className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
            onClick={() => handleClipboardCopy(window.location.href)}
            aria-label={formatText({ id: 'ariaLabel.shareAction' })}
          >
            <ShareNetwork size={18} />
          </button>
        </Tooltip>
      );

    return (
      <motion.div
        transition={{
          ease: 'easeInOut',
        }}
        variants={actionSidebarAnimation}
        exit="hidden"
        initial="hidden"
        animate="visible"
        data-testid="action-drawer"
        className={clsx(
          className,
          `
          fixed
          right-0
          top-[calc(var(--top-content-height))]
          isolate
          z-sidebar
          flex
          h-[calc(100vh-var(--top-content-height))]
          w-full
          flex-col
          border
          border-r-0
          border-gray-200
          bg-base-white
          shadow-default
          transition-[max-width]
          md:bottom-0
          md:top-[calc(var(--top-content-height)+16px)]
          md:h-[calc(100vh-var(--top-content-height)-2rem)]
          md:w-[calc(100vw-248px)]
          md:rounded-l-lg
        `,
          {
            'md:max-w-full': isSidebarFullscreen,
            'md:max-w-[43.375rem]': !isSidebarFullscreen && !isMotion,
            'md:max-w-[67.3125rem]':
              (!isSidebarFullscreen && !!transactionHash && !noActionFound) ||
              (!isSidebarFullscreen && !!transactionId && isLoading),
          },
        )}
        ref={ref}
      >
        <div className="relative">
          <div className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
                onClick={onCloseClick}
                aria-label={formatText({ id: 'ariaLabel.closeModal' })}
              >
                <X size={18} />
              </button>
              {goBackButton && goBackButton}
              {isMobile ? (
                getShareButton()
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
                      onClick={toggleIsSidebarFullscreen}
                      aria-label={formatText({ id: 'ariaLabel.fullWidth' })}
                    >
                      {isSidebarFullscreen ? (
                        <ArrowLineRight size={18} />
                      ) : (
                        <ArrowsOutSimple size={18} />
                      )}
                    </button>
                    {getShareButton()}
                  </div>
                  {statusPill}
                </div>
              )}
            </div>
            {additionalTopContent && <div>{additionalTopContent}</div>}
          </div>
        </div>
        {isLoading ? <ActionSidebarLoadingSkeleton /> : children}
      </motion.div>
    );
  },
);

ActionSidebarLayout.displayName = displayName;
export default ActionSidebarLayout;
