import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { PopoverBaseProps } from './types';
import Card from '../Card';

const displayName = 'Extensions.PopoverBase';

const PopoverBase: FC<PropsWithChildren<PopoverBaseProps>> = ({
  tooltipProps,
  setTooltipRef,
  classNames,
  children,
  cardProps,
  withTooltipStyles = true,
}) => {
  return (
    <div
      ref={setTooltipRef}
      {...tooltipProps({
        className: clsx(classNames, {
          'z-[9999] tooltip-container': withTooltipStyles,
        }),
      })}
    >
      {cardProps ? <Card {...cardProps}>{children}</Card> : children}
    </div>
  );
};

PopoverBase.displayName = displayName;

export default PopoverBase;
