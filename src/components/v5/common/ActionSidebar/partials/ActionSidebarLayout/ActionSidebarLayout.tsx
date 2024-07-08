import { ArrowLineRight, ArrowsOutSimple, X } from '@phosphor-icons/react';
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
import useDetectClickOutside from '~hooks/useDetectClickOutside.ts';
import { formatText } from '~utils/intl.ts';
import { ActionSidebarWidth } from '~v5/common/ActionSidebar/types.ts';

const displayName = 'v5.common.ActionSidebar.ActionSidebarLayout';

interface Props {
  badges?: ReactNode;
  shareButton?: ReactNode;
  userNavigation?: ReactNode;
  width?: ActionSidebarWidth;
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
  width = ActionSidebarWidth.Default,
}) => {
  const { hideActionSidebar } = useActionSidebarContext();

  const [isSidebarMaximized, setIsSidebarMaximized] = useState<boolean>(false);
  const toggleSidebarMaximized = useCallback(() => {
    setIsSidebarMaximized(!isSidebarMaximized);
  }, [isSidebarMaximized]);

  const isMobile = useMobile();

  const ref = useDetectClickOutside({
    onTriggered: hideActionSidebar,
  });

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
          right-0
          top-[calc(var(--top-content-height))]
          isolate
          z-sidebar
          flex
          h-[calc(100dvh-var(--top-content-height))]
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
          md:h-[calc(100dvh-var(--top-content-height)-2rem)]
          md:w-[calc(100vw-248px)]
          md:rounded-l-lg
        `,
        {
          'md:max-w-[43.375rem]': width === ActionSidebarWidth.Default,
          'md:max-w-[67.3125rem]': width === ActionSidebarWidth.Wide,
          'md:!max-w-full': isSidebarMaximized,
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
              onClick={hideActionSidebar}
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
    </motion.div>
  );
};

ActionSidebarLayout.displayName = displayName;

export default ActionSidebarLayout;
