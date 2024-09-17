import { CaretRight } from '@phosphor-icons/react';
import React from 'react';

export const RightButton = () => {
  return (
    <div className="flex h-full items-center rounded-r-lg border border-gray-200 bg-base-bg px-4 py-2 text-gray-400">
      <CaretRight size={18} />
    </div>
  );
};
