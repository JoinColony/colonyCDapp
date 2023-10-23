import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { PopoverBaseProps } from './types';
import Card from '~v5/shared/Card';
import Portal from '~v5/shared/Portal';

const displayName = 'v5.PopoverBase';

const PopoverBase: FC<PropsWithChildren<PopoverBaseProps>> = ({
  tooltipProps,
  setTooltipRef,
  classNames,
  children,
  cardProps,
  withTooltipStyles = true,
  isTopSectionWithBackground,
}) => (
  <Portal>
    <div
      ref={setTooltipRef}
      {...tooltipProps({
        className: clsx(`${classNames} z-10`, {
          'tooltip-container': withTooltipStyles,
        }),
      })}
    >
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
    </div>
  </Portal>
);
PopoverBase.displayName = displayName;

export default PopoverBase;
