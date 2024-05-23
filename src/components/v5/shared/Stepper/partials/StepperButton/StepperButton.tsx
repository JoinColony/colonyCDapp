import clsx from 'clsx';
import React, { useEffect } from 'react';

import { useMobile } from '~hooks';
import { useScrollIntoView } from '~hooks/useScrollIntoView.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';

import StepperTooltip from '../StepperTooltip/StepperTooltip.tsx';

import { ICON_NAME_MAP, StepStage } from './consts.ts';
import { type StepperButtonProps } from './types.ts';

const displayName = 'v5.Stepper.partials.StepperButton';

const StepperButton: React.FC<StepperButtonProps> = ({
  label,
  stage,
  isHighlighted,
  highlightedClassName = '!bg-gray-900 !border-gray-900 !text-base-white',
  className,
  icon,
  tooltipProps,
  ...rest
}) => {
  const { ref, scroll } = useScrollIntoView<HTMLButtonElement>();
  const Icon = icon || ICON_NAME_MAP[stage];
  const isMobile = useMobile();

  useEffect(() => {
    if (isHighlighted) {
      scroll({ behavior: 'smooth', inline: 'end' });
    }
  }, [scroll, isHighlighted]);

  const content = (
    <button
      ref={ref}
      type="button"
      className={clsx(
        className,
        `
          flex
          items-center
          justify-center
          whitespace-nowrap
          rounded-3xl
          border
          px-[.625rem]
          py-1
          transition
          text-4
          md:enabled:hover:border-blue-400
          md:enabled:hover:bg-blue-400
          md:enabled:hover:text-base-white
        `,
        {
          'border-gray-900 bg-base-white text-gray-900':
            !isHighlighted &&
            stage !== StepStage.Skipped &&
            stage !== StepStage.Current,
          [highlightedClassName]: isHighlighted,
          'border-gray-900 bg-gray-900 text-base-white':
            (isHighlighted && stage !== StepStage.Completed) ||
            (!isHighlighted && stage === StepStage.Current),
          'border-blue-400 bg-blue-400 text-base-white':
            isHighlighted && stage === StepStage.Completed,
          'border-gray-400 bg-base-white text-gray-400':
            stage === StepStage.Skipped,
        },
      )}
      {...rest}
    >
      {Icon && <Icon size={12} className="mr-1 flex-shrink-0" />}
      {label}
    </button>
  );

  return tooltipProps ? (
    <>
      {isMobile ? (
        <StepperTooltip tooltipContent={tooltipProps.tooltipContent}>
          {content}
        </StepperTooltip>
      ) : (
        <Tooltip
          placement="right"
          className="!inline-flex"
          tooltipStyle={
            ref.current
              ? {
                  maxWidth: `calc(100% - ${ref.current.offsetWidth}px - 20px)`,
                }
              : undefined
          }
          {...tooltipProps}
        >
          {content}
        </Tooltip>
      )}
    </>
  ) : (
    content
  );
};

StepperButton.displayName = displayName;

export default StepperButton;
