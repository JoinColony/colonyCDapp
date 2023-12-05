import React from 'react';
import clsx from 'clsx';
import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';
import { MotionState } from '~utils/colonyMotions';
import { ICON_NAME_MAP, STEP_STAGE } from './consts';
import { StepperButtonProps } from './types';

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
        `,
        {
          'border-gray-900 text-gray-900 bg-base-white':
            !isHighlighted && stage !== STEP_STAGE.Skipped,
          'lg:enabled:hover:bg-blue-400 lg:enabled:hover:border-blue-400 lg:enabled:hover:text-base-white':
            stage !== STEP_STAGE.Current && label !== MotionState.Staking,
          'bg-gray-900 border-gray-900 text-base-white': isHighlighted,
          'border-gray-400 text-gray-400 bg-base-white':
            stage === STEP_STAGE.Skipped,
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
