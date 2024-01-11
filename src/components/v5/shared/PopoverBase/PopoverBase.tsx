import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';

import MenuContainer from '~v5/shared/MenuContainer';

import { PopoverBaseProps } from './types';

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
      className: clsx(classNames, 'z-[62]', {
        'tooltip-container': withTooltipStyles,
      }),
    })}
  >
    {cardProps ? (
      <MenuContainer
        className="w-full"
        {...cardProps}
        withPadding={isTopSectionWithBackground}
      >
        {children}
      </MenuContainer>
    ) : (
      children
    )}
  </div>
);
PopoverBase.displayName = displayName;

export default PopoverBase;
