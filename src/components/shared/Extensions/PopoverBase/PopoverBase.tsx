import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { PopoverBaseProps } from './types';
import Card from '../Card';

const displayName = 'shared.Extensions.PopoverBase';

const PopoverBase: FC<PropsWithChildren<PopoverBaseProps>> = ({
  tooltipProps,
  setTooltipRef,
  classNames,
  children,
  cardProps,
  withoutTooltipStyles,
}) => {
  return (
    <div
      ref={setTooltipRef}
      {...tooltipProps({
        className: clsx(classNames, {
          'z-[9999] tooltip-container': !withoutTooltipStyles,
        }),
      })}
    >
      {cardProps ? <Card {...cardProps}>{children}</Card> : children}
    </div>
  );
};

PopoverBase.displayName = displayName;

export default PopoverBase;
