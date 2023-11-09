import React, { FC, PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import { PopoverBaseProps } from './types';
import Card from '~v5/shared/Card';

const displayName = 'v5.PopoverBase';

const PopoverBase: FC<PropsWithChildren<PopoverBaseProps>> = ({
  tooltipProps,
  setTooltipRef,
  classNames,
  children,
  cardProps,
  withTooltipStyles = true,
  isTopSectionWithBackground,
  withMotionAnimation,
}) => {
  const content = (
    <>
      {cardProps ? (
        <Card
          className="w-full"
          {...cardProps}
          withPadding={isTopSectionWithBackground}
        >
          {children}
        </Card>
      ) : (
        children
      )}
    </>
  );

  return withMotionAnimation ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={setTooltipRef}
      {...tooltipProps({
        className: clsx(classNames, 'z-10', {
          'tooltip-container': withTooltipStyles,
        }),
      })}
    >
      {content}
    </motion.div>
  ) : (
    <div
      ref={setTooltipRef}
      {...tooltipProps({
        className: clsx(classNames, 'z-10', {
          'tooltip-container': withTooltipStyles,
        }),
      })}
    >
      {content}
    </div>
  );
};

PopoverBase.displayName = displayName;

export default PopoverBase;
