import clsx from 'clsx';
import React from 'react';

export const ActiveColonyIndicator = ({ isActive }: { isActive: boolean }) => {
  return (
    <div
      className={clsx(
        'flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-gray-200',
        {
          '!border-gray-900': isActive,
        },
      )}
    >
      {isActive && <div className="h-2 w-2 rounded-full bg-gray-900" />}
    </div>
  );
};
