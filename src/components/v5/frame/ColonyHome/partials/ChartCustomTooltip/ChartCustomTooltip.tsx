import { useTooltipState } from '@nivo/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type PropsWithChildren, type FC, useEffect } from 'react';

interface ChartCustomTooltipProps extends PropsWithChildren {
  onVisible?: (isVisible?: boolean) => void;
}

export const ChartCustomTooltip: FC<ChartCustomTooltipProps> = ({
  children,
  onVisible,
}) => {
  const { isVisible } = useTooltipState();

  useEffect(() => {
    return () => {
      if (onVisible) {
        onVisible(false);
      }
    };
    // We are not including any deps here as we want to run react only to mounting/unmounting state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isVisible && onVisible) {
      onVisible(true);
    }
    // We are not including onVisible here as we really only want to react to changes of isVisible
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative flex flex-col items-center">
            <div className="rounded-full bg-base-black px-2.5 py-1 text-sm font-semibold text-base-white">
              {children}
            </div>
            <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-base-black" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
