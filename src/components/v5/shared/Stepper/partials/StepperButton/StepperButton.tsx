import clsx from 'clsx';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import Icon from '~shared/Icon/index.ts';

import { ICON_NAME_MAP, StepStage } from './consts.ts';
import { StepperButtonProps } from './types.ts';

const displayName = 'v5.Stepper.partials.StepperButton';

const StepperButton: React.FC<StepperButtonProps> = ({
  label,
  stage,
  isHighlighted,
  className,
  iconName,
  tooltipProps,
  ...rest
}) => {
  const icon = iconName || ICON_NAME_MAP[stage];

  const content = (
    <button
      type="button"
      className={clsx(
        className,
        `
          flex
          items-center
          justify-center
          border
          px-[.625rem]
          py-1
          rounded-3xl
          transition
          text-4
          lg:enabled:hover:bg-gray-900
          lg:enabled:hover:border-gray-900
          lg:enabled:hover:text-base-white
        `,
        {
          'border-gray-900 text-gray-900 bg-base-white':
            !isHighlighted && stage !== StepStage.Skipped,
          '!bg-gray-900 !border-gray-900 !text-base-white': isHighlighted,
          'border-gray-400 text-gray-400 bg-base-white':
            stage === StepStage.Skipped,
        },
      )}
      {...rest}
    >
      {icon && (
        <Icon
          name={icon}
          appearance={{
            size: 'extraTiny',
          }}
          className="mr-1 flex-shrink-0"
        />
      )}
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
