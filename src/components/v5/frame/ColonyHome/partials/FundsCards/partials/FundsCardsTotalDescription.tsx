import { ArrowUp, ArrowDown } from '@phosphor-icons/react';
import React from 'react';

type ArrowDirection = 'up' | 'down';

interface FundsCardsTotalDescriptionProps {
  direction: ArrowDirection;
}

// @TODO create logic for this component, props etc
export const FundsCardsTotalDescription: React.FC<
  FundsCardsTotalDescriptionProps
> = ({ direction }) => {
  const Arrow = direction === 'up' ? ArrowUp : ArrowDown;

  return (
    <div className="flex w-full justify-between text-xs">
      <span className="uppercase text-gray-400">Native 1.56M CLNY</span>
      <span className="flex items-center gap-1 font-medium text-blue-400">
        <Arrow weight="bold" />
        <span>15% Week</span>
      </span>
    </div>
  );
};
