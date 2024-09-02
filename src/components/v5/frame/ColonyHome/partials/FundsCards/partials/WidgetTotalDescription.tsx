import { ArrowUp } from '@phosphor-icons/react';
import React from 'react';

// @TODO create logic for this component, props etc
export const WidgetTotalDescription = () => {
  return (
    <div className="flex w-full justify-between text-xs">
      <span className="text-gray-400">Native 1.56M CLNY</span>
      <span className="flex items-center text-blue-400">
        <ArrowUp />
        15% Week
      </span>
    </div>
  );
};
