import React, { type PropsWithChildren, type FC } from 'react';

import useRelativePortalElement from '~hooks/useRelativePortalElement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Portal from '~v5/shared/Portal/Portal.tsx';

import { type StepperTooltipProps } from './types.ts';

const StepperTooltip: FC<PropsWithChildren<StepperTooltipProps>> = ({
  tooltipContent,
  children,
}) => {
  const [
    isTooltipVisible,
    {
      toggleOn: toggleOnTooltip,
      toggleOff: toggleOffTooltip,
      registerContainerRef,
    },
  ] = useToggle();

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLDivElement,
    HTMLDivElement
  >([isTooltipVisible], {
    top: 16,
  });
  const {
    portalElementRef: arrowPortalElementRef,
    relativeElementRef: arrowRelativeElementRef,
  } = useRelativePortalElement<HTMLDivElement, HTMLDivElement>(
    [isTooltipVisible],
    {
      top: 8,
      customLeftPosition: 25,
    },
  );

  return (
    <>
      <div
        className="flex"
        ref={(ref) => {
          relativeElementRef.current = ref;
          arrowRelativeElementRef.current = ref;
        }}
        onMouseOver={toggleOnTooltip}
        onFocus={toggleOnTooltip}
        onMouseLeave={toggleOffTooltip}
      >
        {children}
      </div>
      {isTooltipVisible && (
        <Portal>
          <div
            className="tooltip-container group absolute z-[65] rounded-none border-none 
            bg-gray-900 p-3 !text-base-white 
            shadow-none text-3 hover-[&_a]:no-underline 
            [&_a]:underline"
            ref={(ref) => {
              registerContainerRef(ref);
              portalElementRef.current = ref;
            }}
          >
            <div
              ref={(ref) => {
                registerContainerRef(ref);
                arrowPortalElementRef.current = ref;
              }}
              className="fixed
                z-[60]
                block
                border-b-[0.625rem] 
                border-l-[0.5rem]
                border-r-[0.5rem] 
                border-t-0 
                border-b-gray-900 
                border-l-transparent 
                border-r-transparent 
                border-t-transparent"
            />
            <div className="flex max-w-[15.625rem] flex-col items-start">
              {tooltipContent}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default StepperTooltip;
