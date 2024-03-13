import clsx from 'clsx';
import React, { type FC } from 'react';

import StatusCircle from '~shared/StatusCircle/StatusCircle.tsx';
import { formatText } from '~utils/intl.ts';

import { type PillProps } from '../types.ts';

const displayName = 'v5.common.Fields.Input.partials.InputPills';

const InputPills: FC<PillProps> = ({ message, status }) => {
  return (
    <div
      className={clsx(
        `absolute flex items-center gap-1 self-start pt-1 text-sm font-normal`,
        {
          'text-negative-400': status === 'error',
          'text-success-400': status === 'success',
          'text-warning-400': status === 'warn',
        },
      )}
    >
      <StatusCircle size={14} status={status} />
      {message && <span>{formatText(message)}</span>}
    </div>
  );
};

InputPills.displayName = displayName;

export default InputPills;
