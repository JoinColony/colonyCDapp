import { X } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';

import { type MeatBallMenuCloseTriggerProps } from '../types.ts';

export const MeatBallMenuCloseTrigger: FC<MeatBallMenuCloseTriggerProps> = ({
  onClick,
}) => (
  <div className="mb-3 flex items-center justify-between sm:hidden">
    <p className="uppercase text-gray-400 text-4">
      {formatText({ id: 'meatballMenu.selectAction' })}
    </p>
    <button type="button" className="text-gray-400" onClick={onClick}>
      <X size={18} />
    </button>
  </div>
);
