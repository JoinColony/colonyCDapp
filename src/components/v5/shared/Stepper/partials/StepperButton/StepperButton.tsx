import React from 'react';
import clsx from 'clsx';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip';
import Icon from '~shared/Icon/Icon';
import { StepperButtonProps } from './types';

const StepperButton: React.FC<StepperButtonProps> = ({
  label,
  stage,
  isHighlighted,
  className,
  iconName,
  tooltipProps,
  ...rest
}) => {
  const iconNameMap = {
    completed: 'check',
    current: undefined,
    upcoming: undefined,
  };

  const icon = iconName || iconNameMap[stage];

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
          lg:enabled:hover:bg-blue-400
          lg:enabled:hover:border-blue-400
          lg:enabled:hover:text-white
        `,
        {
          'border-gray-900 text-gray-900 bg-white':
            !isHighlighted && stage !== 'skipped',
          'bg-gray-900 border-gray-900 text-white': isHighlighted,
          'border-gray-400 text-gray-400 bg-white': stage === 'skipped',
        },
      )}
      {...rest}
    >
      {icon && (
        <Icon
          name={icon}
          className="h-[.625rem] w-[.625rem] mr-1 flex-shrink-0"
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

export default StepperButton;
