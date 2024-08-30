import { useTooltipState } from '@nivo/tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type PropsWithChildren, type FC } from 'react';

interface ChartCustomTooltipProps extends PropsWithChildren {}

export const ChartCustomTooltip: FC<ChartCustomTooltipProps> = ({
  children,
}) => {
  const { isVisible } = useTooltipState();
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
