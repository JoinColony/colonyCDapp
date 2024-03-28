import clsx from 'clsx';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';

import { ICON_NAME_MAP, StepStage } from './consts.ts';
import { type StepperButtonProps } from './types.ts';

const displayName = 'v5.Stepper.partials.StepperButton';

const StepperButton: React.FC<StepperButtonProps> = ({
  label,
  stage,
  isHighlighted,
  className,
  icon,
  tooltipProps,
  ...rest
}) => {
  const Icon = icon || ICON_NAME_MAP[stage];

  const content = (
    <button
      type="button"
      className={clsx(
        className,
        `
          flex
          items-center
          justify-center
          rounded-3xl
          border
          px-[.625rem]
          py-1
          transition
          text-4
          lg:enabled:hover:border-gray-900
          lg:enabled:hover:bg-gray-900
          lg:enabled:hover:text-base-white
        `,
        {
          'border-gray-900 bg-base-white text-gray-900':
            !isHighlighted && stage !== StepStage.Current,
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
    <Tooltip placement="right" className="!inline-flex" {...tooltipProps}>
      {content}
    </Tooltip>
  ) : (
    content
  );
};

StepperButton.displayName = displayName;

export default StepperButton;
