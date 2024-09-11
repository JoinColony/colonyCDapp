import { CaretLeft } from '@phosphor-icons/react';
import React from 'react';

export const LeftButton = () => {
  return (
    <div className="flex h-full items-center rounded-l-lg border border-gray-200 bg-base-bg px-4 py-2 text-gray-400">
      <CaretLeft size={14} />
    </div>
  );
};
