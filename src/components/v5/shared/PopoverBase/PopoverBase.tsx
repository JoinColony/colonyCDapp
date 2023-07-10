import React, { FC, PropsWithChildren } from 'react';
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
}) => (
  <div
    ref={setTooltipRef}
    {...tooltipProps({
      className: clsx(`${classNames} z-10`, {
        'tooltip-container': withTooltipStyles,
      }),
    })}
  >
    {cardProps ? (
      <Card {...cardProps} withPaddings={isTopSectionWithBackground}>
        {children}
      </Card>
    ) : (
      children
    )}
  </div>
);
PopoverBase.displayName = displayName;

export default PopoverBase;
