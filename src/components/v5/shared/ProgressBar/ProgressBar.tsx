import React, { FC } from 'react';

import { ProgressBarProps } from './types';

const ProgressBar: FC<ProgressBarProps> = ({ progress }) => (
  <div className="flex items-center">
    <div className="relative w-full h-2 rounded bg-gray-200">
      <span
        className="bg-blue-400 h-full absolute left-0 top-0 rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
    <span className="text-3 text-gray-600 ml-3">{progress || 0}%</span>
  </div>
);

export default ProgressBar;
